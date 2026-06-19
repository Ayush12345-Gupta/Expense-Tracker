import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { useExpenses } from "../../context/ExpenseContext";
import { formatCurrency, getMonthKey, getMonthLabel } from "../../utils/helpers";
import {
  getWeeklySpending,
  getMonthlyComparison,
  isCurrentMonth,
} from "../../utils/analytics";
import "./AdvancedAnalytics.css";

const COLORS = {
  income: "#22c55e",
  expense: "#ef4444",
  primary: "#6366f1",
  savings: "#14b8a6",
};

export default function AdvancedAnalytics() {
  const { expenses, expenseItems, categories, monthlyIncome, monthlyIncomeTotal } = useExpenses();

  const categoryData = categories
    .map((cat) => {
      const total = expenseItems
        .filter((e) => e.categoryId === cat.id && isCurrentMonth(e.date))
        .reduce((sum, e) => sum + Number(e.amount), 0);
      return { name: cat.name, value: total, color: cat.color, icon: cat.icon };
    })
    .filter((d) => d.value > 0);

  const monthMap = {};
  expenseItems.forEach((e) => {
    const key = getMonthKey(e.date);
    monthMap[key] = (monthMap[key] || 0) + Number(e.amount);
  });

  const monthlyExpenseData = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([key, amount]) => ({
      month: getMonthLabel(key),
      amount,
    }));

  const weeklyData = getWeeklySpending(expenses, 8);
  const incomeVsExpense = getMonthlyComparison(expenses, monthlyIncome, 6);

  if (expenses.length === 0) {
    return (
      <div className="analytics__empty">
        <span>📊</span>
        <h3>No analytics data yet</h3>
        <p>Add expenses or income to see your advanced analytics dashboard</p>
      </div>
    );
  }

  return (
    <div className="analytics">
      <div className="analytics__summary">
        <div className="analytics__summary-card analytics__summary-card--income">
          <span>💵</span>
          <div>
            <p>Monthly Income</p>
            <strong>{formatCurrency(monthlyIncomeTotal)}</strong>
          </div>
        </div>
        <div className="analytics__summary-card analytics__summary-card--expense">
          <span>💸</span>
          <div>
            <p>Monthly Expenses</p>
            <strong>
              {formatCurrency(
                expenseItems
                  .filter((e) => isCurrentMonth(e.date))
                  .reduce((s, e) => s + Number(e.amount), 0)
              )}
            </strong>
          </div>
        </div>
        <div className="analytics__summary-card analytics__summary-card--savings">
          <span>🏦</span>
          <div>
            <p>Net Savings</p>
            <strong>
              {formatCurrency(
                monthlyIncomeTotal -
                  expenseItems
                    .filter((e) => isCurrentMonth(e.date))
                    .reduce((s, e) => s + Number(e.amount), 0)
              )}
            </strong>
          </div>
        </div>
      </div>

      <div className="analytics__grid">
        <div className="analytics__card analytics__card--wide">
          <div className="analytics__card-header">
            <h3>📊 Monthly Expense Chart</h3>
            <span>Last 8 months</span>
          </div>
          {monthlyExpenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyExpenseData}>
                <defs>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  name="Expenses"
                  stroke={COLORS.primary}
                  fill="url(#expenseGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="analytics__no-data">No monthly data available</p>
          )}
        </div>

        <div className="analytics__card">
          <div className="analytics__card-header">
            <h3>🥧 Category Pie Chart</h3>
            <span>This month</span>
          </div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) =>
                    percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                  }
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="analytics__no-data">No category spending this month</p>
          )}
        </div>

        <div className="analytics__card analytics__card--wide">
          <div className="analytics__card-header">
            <h3>💰 Income vs Expense</h3>
            <span>6-month comparison</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={incomeVsExpense} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="income" name="Income" fill={COLORS.income} radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill={COLORS.expense} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="analytics__card analytics__card--wide">
          <div className="analytics__card-header">
            <h3>📈 Weekly Spending Graph</h3>
            <span>Last 8 weeks</span>
          </div>
          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Weekly Spend"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="analytics__no-data">Not enough weekly data</p>
          )}
        </div>

        <div className="analytics__card analytics__card--full">
          <div className="analytics__card-header">
            <h3>Category Breakdown</h3>
            <span>This month</span>
          </div>
          <div className="analytics__breakdown">
            {categoryData
              .sort((a, b) => b.value - a.value)
              .map((d) => {
                const max = categoryData[0]?.value || 1;
                return (
                  <div key={d.name} className="analytics__breakdown-row">
                    <span className="analytics__breakdown-label">
                      {d.icon} {d.name}
                    </span>
                    <div className="analytics__breakdown-track">
                      <div
                        className="analytics__breakdown-fill"
                        style={{
                          width: `${(d.value / max) * 100}%`,
                          background: d.color,
                        }}
                      />
                    </div>
                    <span className="analytics__breakdown-value">{formatCurrency(d.value)}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
