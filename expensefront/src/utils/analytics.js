import { getMonthKey } from "./helpers";

export function isCurrentMonth(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return start.toISOString().split("T")[0];
}

export function getWeekLabel(key) {
  const d = new Date(key);
  const end = new Date(d);
  end.setDate(d.getDate() + 6);
  const fmt = (dt) =>
    dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${fmt(d)} – ${fmt(end)}`;
}

export function getWeeklySpending(expenses, weeks = 8) {
  const expenseOnly = expenses.filter((e) => e.type !== "income");
  const map = {};

  expenseOnly.forEach((e) => {
    const key = getWeekKey(e.date);
    map[key] = (map[key] || 0) + Number(e.amount);
  });

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-weeks)
    .map(([key, amount]) => ({ week: getWeekLabel(key), amount, key }));
}

export function getMonthlyComparison(expenses, monthlyIncome, months = 6) {
  const map = {};

  expenses.forEach((e) => {
    const key = getMonthKey(e.date);
    if (!map[key]) map[key] = { income: 0, expense: 0 };
    if (e.type === "income") {
      map[key].income += Number(e.amount);
    } else {
      map[key].expense += Number(e.amount);
    }
  });

  const now = new Date();
  const result = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = getMonthKey(d.toISOString());
    const data = map[key] || { income: 0, expense: 0 };
    const isCurrent = i === 0;
    const income = data.income + (isCurrent && data.income === 0 ? monthlyIncome : 0);

    result.push({
      month: d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
      income: income || data.income,
      expense: data.expense,
      savings: (income || data.income) - data.expense,
    });
  }

  return result;
}

export function getCategorySpending(expenses, categoryId, monthOnly = true) {
  return expenses
    .filter((e) => {
      if (e.type === "income") return false;
      if (e.categoryId !== categoryId) return false;
      return monthOnly ? isCurrentMonth(e.date) : true;
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);
}

export function getBudgetStatus(categories, expenses, budgets) {
  return categories.map((cat) => {
    const limit = budgets[cat.id] || 0;
    const spent = getCategorySpending(expenses, cat.id, true);
    const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    let status = "ok";
    if (limit > 0 && spent > limit) status = "exceeded";
    else if (limit > 0 && percent >= 80) status = "warning";

    return { category: cat, limit, spent, percent, status };
  });
}

export function generateAlerts({
  expenses,
  categories,
  budgets,
  monthlyIncome,
  dismissedIds = [],
}) {
  const alerts = [];
  const now = Date.now();

  const budgetStatuses = getBudgetStatus(categories, expenses, budgets);
  budgetStatuses.forEach(({ category, limit, spent, percent, status }) => {
    if (limit <= 0) return;
    if (status === "exceeded") {
      alerts.push({
        id: `budget-exceeded-${category.id}`,
        type: "danger",
        title: "Budget exceeded",
        message: `${category.icon} ${category.name}: ${formatAmt(spent)} spent of ${formatAmt(limit)} budget`,
        time: now,
      });
    } else if (status === "warning") {
      alerts.push({
        id: `budget-warning-${category.id}`,
        type: "warning",
        title: "Budget almost full",
        message: `${category.icon} ${category.name} is at ${percent}% (${formatAmt(spent)} / ${formatAmt(limit)})`,
        time: now,
      });
    }
  });

  const monthExpenses = expenses.filter((e) => e.type !== "income" && isCurrentMonth(e.date));
  const monthTotal = monthExpenses.reduce((s, e) => s + Number(e.amount), 0);

  if (monthlyIncome > 0 && monthTotal > monthlyIncome) {
    alerts.push({
      id: "income-exceeded",
      type: "danger",
      title: "Spending exceeds income",
      message: `You've spent ${formatAmt(monthTotal)} this month vs ${formatAmt(monthlyIncome)} income`,
      time: now,
    });
  }

  const highThreshold = 5000;
  const recentHigh = monthExpenses.filter((e) => Number(e.amount) >= highThreshold);
  if (recentHigh.length > 0) {
    const biggest = recentHigh.sort((a, b) => b.amount - a.amount)[0];
    alerts.push({
      id: `high-spend-${biggest.id}`,
      type: "warning",
      title: "High spending detected",
      message: `"${biggest.title}" cost ${formatAmt(biggest.amount)} — review if unexpected`,
      time: now,
    });
  }

  const weekly = getWeeklySpending(expenses, 2);
  if (weekly.length >= 2) {
    const current = weekly[weekly.length - 1].amount;
    const previous = weekly[weekly.length - 2].amount;
    if (previous > 0 && current > previous * 1.5 && current > 3000) {
      alerts.push({
        id: "weekly-spike",
        type: "info",
        title: "Weekly spending spike",
        message: `This week (${formatAmt(current)}) is 50%+ higher than last week (${formatAmt(previous)})`,
        time: now,
      });
    }
  }

  return alerts.filter((a) => !dismissedIds.includes(a.id));
}

function formatAmt(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}
