import { useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { formatCurrency } from "../../utils/helpers";
import BudgetProgress from "../../components/Budget/BudgetProgress";
import "./Budget.css";

export default function Budget() {
  const {
    categories,
    budgets,
    budgetStatuses,
    monthlyIncome,
    setBudget,
    setMonthlyIncome,
  } = useExpenses();

  const [editingIncome, setEditingIncome] = useState(false);
  const [incomeInput, setIncomeInput] = useState(String(monthlyIncome || ""));
  const [budgetInputs, setBudgetInputs] = useState({});

  const activeBudgets = budgetStatuses.filter((b) => b.limit > 0);
  const totalBudget = activeBudgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = activeBudgets.reduce((s, b) => s + b.spent, 0);

  const handleSaveIncome = () => {
    setMonthlyIncome(incomeInput);
    setEditingIncome(false);
  };

  const handleBudgetChange = (categoryId, value) => {
    setBudgetInputs((prev) => ({ ...prev, [categoryId]: value }));
  };

  const handleBudgetSave = (categoryId) => {
    const val = budgetInputs[categoryId] ?? budgets[categoryId] ?? "";
    setBudget(categoryId, val);
    setBudgetInputs((prev) => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
  };

  return (
    <div className="budget-page">
      <div className="budget-page__top">
        <div className="budget-page__income-card">
          <div className="budget-page__income-header">
            <h3>💵 Monthly Income</h3>
            {!editingIncome && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setIncomeInput(String(monthlyIncome || ""));
                  setEditingIncome(true);
                }}
              >
                Edit
              </button>
            )}
          </div>
          {editingIncome ? (
            <div className="budget-page__income-edit">
              <input
                type="number"
                min="0"
                placeholder="e.g. 50000"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
              />
              <button type="button" className="btn btn--primary" onClick={handleSaveIncome}>
                Save
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setEditingIncome(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <p className="budget-page__income-value">{formatCurrency(monthlyIncome)}</p>
          )}
          <span className="budget-page__income-hint">
            Used for income vs expense comparison in analytics
          </span>
        </div>

        <div className="budget-page__overview">
          <div className="budget-page__overview-item">
            <span>Total Budget</span>
            <strong>{formatCurrency(totalBudget)}</strong>
          </div>
          <div className="budget-page__overview-item">
            <span>Total Spent</span>
            <strong>{formatCurrency(totalSpent)}</strong>
          </div>
          <div className="budget-page__overview-item">
            <span>Remaining</span>
            <strong className={totalBudget - totalSpent < 0 ? "text-danger" : ""}>
              {formatCurrency(Math.max(totalBudget - totalSpent, 0))}
            </strong>
          </div>
        </div>
      </div>

      <div className="budget-page__section">
        <h3>Set Monthly Budget per Category</h3>
        <p className="budget-page__desc">
          Set limits for each category. You&apos;ll get warnings at 80% and alerts when exceeded.
        </p>

        <div className="budget-page__set-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="budget-page__set-item">
              <span>
                {cat.icon} {cat.name}
              </span>
              <div className="budget-page__set-input">
                <span>₹</span>
                <input
                  type="number"
                  min="0"
                  placeholder="10000"
                  value={budgetInputs[cat.id] ?? budgets[cat.id] ?? ""}
                  onChange={(e) => handleBudgetChange(cat.id, e.target.value)}
                  onBlur={() => handleBudgetSave(cat.id)}
                  onKeyDown={(e) => e.key === "Enter" && handleBudgetSave(cat.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeBudgets.length > 0 ? (
        <div className="budget-page__section">
          <h3>Budget Progress</h3>
          <div className="budget-page__progress-list">
            {budgetStatuses
              .filter((b) => b.limit > 0)
              .sort((a, b) => b.percent - a.percent)
              .map((b) => (
                <BudgetProgress key={b.category.id} {...b} category={b.category} />
              ))}
          </div>
        </div>
      ) : (
        <div className="budget-page__empty">
          <span>🎯</span>
          <p>Set budget limits above to start tracking your spending</p>
        </div>
      )}
    </div>
  );
}
