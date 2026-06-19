import { useExpenses } from "../../context/ExpenseContext";
import { getCategoryById } from "../../utils/categories";
import { formatCurrency, formatDate } from "../../utils/helpers";
import "./ExpenseList.css";

export default function ExpenseList({ expenses, onEdit, limit }) {
  const { categories, deleteExpense } = useExpenses();
  const list = limit ? expenses.slice(0, limit) : expenses;

  if (list.length === 0) {
    return (
      <div className="expense-list__empty">
        <span className="expense-list__empty-icon">📭</span>
        <p>No expenses yet</p>
        <span>Add your first expense to get started</span>
      </div>
    );
  }

  return (
    <div className="expense-list">
      {list.map((expense) => {
        const category = getCategoryById(expense.categoryId, categories);
        return (
          <div key={expense.id} className="expense-item">
            <div
              className="expense-item__icon"
              style={{ background: `${category.color}18`, color: category.color }}
            >
              {category.icon}
            </div>
            <div className="expense-item__info">
              <p className="expense-item__title">{expense.title}</p>
              <p className="expense-item__meta">
                {category.name} · {formatDate(expense.date)}
              </p>
            </div>
            <p
              className={`expense-item__amount expense-item__amount--${expense.type === "income" ? "income" : "expense"}`}
            >
              {expense.type === "income" ? "+" : "-"}
              {formatCurrency(expense.amount)}
            </p>
            <div className="expense-item__actions">
              {onEdit && (
                <button
                  type="button"
                  className="expense-item__btn"
                  onClick={() => onEdit(expense)}
                  title="Edit"
                >
                  ✎
                </button>
              )}
              <button
                type="button"
                className="expense-item__btn expense-item__btn--danger"
                onClick={() => deleteExpense(expense.id)}
                title="Delete"
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
