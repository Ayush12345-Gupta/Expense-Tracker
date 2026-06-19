import { Link } from "react-router-dom";
import { useExpenses } from "../../context/ExpenseContext";
import { formatCurrency } from "../../utils/helpers";
import StatCard from "../../components/StatCard/StatCard";
import ExpenseList from "../../components/ExpenseList/ExpenseList";
import BudgetProgress from "../../components/Budget/BudgetProgress";
import "./Dashboard.css";

export default function Dashboard() {
  const {
    expenseItems,
    monthlyTotal,
    monthlyIncomeTotal,
    totalSpent,
    thisMonthExpenses,
    categories,
    budgetStatuses,
    alerts,
  } = useExpenses();

  const avgExpense =
    expenseItems.length > 0 ? Math.round(totalSpent / expenseItems.length) : 0;

  const savings = monthlyIncomeTotal - monthlyTotal;
  const overBudget = budgetStatuses.filter((b) => b.status === "exceeded");
  const warningBudget = budgetStatuses.filter((b) => b.status === "warning");

  return (
    <div className="dashboard">
      {alerts.length > 0 && (
        <div className="dashboard__alert-banner">
          <span>🔔</span>
          <p>
            You have <strong>{alerts.length} active alert{alerts.length > 1 ? "s" : ""}</strong>
            {overBudget.length > 0 && ` — ${overBudget.length} budget(s) exceeded`}
          </p>
          <Link to="/alerts">View alerts →</Link>
        </div>
      )}

      <div className="dashboard__stats">
        <StatCard
          label="This Month"
          value={formatCurrency(monthlyTotal)}
          icon="📅"
          variant="primary"
        />
        <StatCard
          label="Income"
          value={formatCurrency(monthlyIncomeTotal)}
          icon="💵"
          variant="success"
        />
        <StatCard
          label="Net Savings"
          value={formatCurrency(savings)}
          icon="🏦"
          variant={savings >= 0 ? "info" : "warning"}
        />
        <StatCard
          label="Avg. Expense"
          value={formatCurrency(avgExpense)}
          icon="📊"
          variant="warning"
        />
      </div>

      <div className="dashboard__grid">
        <div className="dashboard__card">
          <div className="dashboard__card-header">
            <h3>Recent Transactions</h3>
            <Link to="/expenses" className="dashboard__link">
              View all →
            </Link>
          </div>
          <ExpenseList expenses={expenseItems} limit={5} />
        </div>

        <div className="dashboard__card">
          <div className="dashboard__card-header">
            <h3>Budget Overview</h3>
            <Link to="/budget" className="dashboard__link">
              Manage →
            </Link>
          </div>
          {budgetStatuses.filter((b) => b.limit > 0).length > 0 ? (
            <div className="dashboard__budget-list">
              {budgetStatuses
                .filter((b) => b.limit > 0)
                .slice(0, 3)
                .map((b) => (
                  <BudgetProgress key={b.category.id} {...b} category={b.category} />
                ))}
            </div>
          ) : (
            <div className="dashboard__budget-empty">
              <p>No budgets set yet</p>
              <Link to="/budget" className="btn btn--primary">
                Set budgets
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard__quick">
        <h3>Quick Stats</h3>
        <div className="dashboard__quick-grid">
          <div className="dashboard__quick-item">
            <span>Categories</span>
            <strong>{categories.length}</strong>
          </div>
          <div className="dashboard__quick-item">
            <span>This month&apos;s expenses</span>
            <strong>{thisMonthExpenses.length}</strong>
          </div>
          <div className="dashboard__quick-item">
            <span>Budget warnings</span>
            <strong className={warningBudget.length > 0 ? "text-warning" : ""}>
              {warningBudget.length + overBudget.length}
            </strong>
          </div>
          <div className="dashboard__quick-item">
            <span>
              <Link to="/charts" className="dashboard__link">
                View full analytics →
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
