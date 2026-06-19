import { useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { formatCurrency } from "../../utils/helpers";
import "./Categories.css";

const COLORS = ["#6366f1", "#f97316", "#22c55e", "#ec4899", "#3b82f6", "#14b8a6", "#8b5cf6"];
const ICONS = ["🍔", "🚗", "🛍️", "📄", "🎬", "💊", "📦", "🏠", "✈️", "📚"];

export default function Categories() {
  const { categories, expenseItems, addCategory, deleteCategory } = useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", color: COLORS[0], icon: ICONS[0] });

  const getCategoryTotal = (id) =>
    expenseItems.filter((e) => e.categoryId === id).reduce((s, e) => s + Number(e.amount), 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addCategory(form);
    setForm({ name: "", color: COLORS[0], icon: ICONS[0] });
    setShowForm(false);
  };

  return (
    <div className="categories-page">
      <div className="categories-page__header">
        <p>Organize your spending with custom categories</p>
        <button type="button" className="btn btn--primary" onClick={() => setShowForm(!showForm)}>
          + Add Category
        </button>
      </div>

      {showForm && (
        <form className="categories-page__form" onSubmit={handleAdd}>
          <input
            placeholder="Category name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <div className="categories-page__pickers">
            <div>
              <label>Color</label>
              <div className="categories-page__colors">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`categories-page__color${form.color === c ? " categories-page__color--active" : ""}`}
                    style={{ background: c }}
                    onClick={() => setForm({ ...form, color: c })}
                  />
                ))}
              </div>
            </div>
            <div>
              <label>Icon</label>
              <div className="categories-page__icons">
                {ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    className={`categories-page__icon${form.icon === ic ? " categories-page__icon--active" : ""}`}
                    onClick={() => setForm({ ...form, icon: ic })}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="categories-page__form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Save Category
            </button>
          </div>
        </form>
      )}

      <div className="categories-page__grid">
        {categories.map((cat) => {
          const total = getCategoryTotal(cat.id);
          const count = expenseItems.filter((e) => e.categoryId === cat.id).length;
          return (
            <div key={cat.id} className="category-card">
              <div className="category-card__top">
                <span className="category-card__icon" style={{ background: `${cat.color}18`, color: cat.color }}>
                  {cat.icon}
                </span>
                <button
                  type="button"
                  className="category-card__delete"
                  onClick={() => deleteCategory(cat.id)}
                  title="Delete category"
                >
                  ✕
                </button>
              </div>
              <h4>{cat.name}</h4>
              <p className="category-card__total">{formatCurrency(total)}</p>
              <p className="category-card__count">{count} transactions</p>
              <div className="category-card__bar">
                <div style={{ width: `${Math.min((count / Math.max(expenseItems.length, 1)) * 100, 100)}%`, background: cat.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
