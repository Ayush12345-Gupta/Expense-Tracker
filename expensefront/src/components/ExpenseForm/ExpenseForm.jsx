import { useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import "./ExpenseForm.css";

const emptyForm = {
  title: "",
  amount: "",
  categoryId: "",
  date: new Date().toISOString().split("T")[0],
  note: "",
  type: "expense",
};

export default function ExpenseForm({ onSuccess, editExpense, onCancel }) {
  const { categories, addExpense, updateExpense } = useExpenses();
  const [form, setForm] = useState(
    editExpense
      ? {
          title: editExpense.title,
          amount: String(editExpense.amount),
          categoryId: editExpense.categoryId,
          date: editExpense.date,
          note: editExpense.note || "",
          type: editExpense.type || "expense",
        }
      : { ...emptyForm, categoryId: categories[0]?.id || "" }
  );
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required");
    if (!form.amount || Number(form.amount) <= 0) return setError("Enter a valid amount");
    if (!form.categoryId) return setError("Select a category");

    const payload = {
      title: form.title.trim(),
      amount: Number(form.amount),
      categoryId: form.categoryId,
      date: form.date,
      note: form.note.trim(),
      type: form.type,
    };

    if (editExpense) {
      updateExpense(editExpense.id, payload);
    } else {
      addExpense(payload);
    }

    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
    setError("");
    onSuccess?.();
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      {error && <div className="expense-form__error">{error}</div>}

      <div className="expense-form__grid">
        <div className="expense-form__field expense-form__field--full">
          <label>Type</label>
          <div className="expense-form__type-toggle">
            <button
              type="button"
              className={form.type === "expense" ? "active expense" : ""}
              onClick={() => setForm({ ...form, type: "expense" })}
            >
              💸 Expense
            </button>
            <button
              type="button"
              className={form.type === "income" ? "active income" : ""}
              onClick={() => setForm({ ...form, type: "income" })}
            >
              💵 Income
            </button>
          </div>
        </div>

        <div className="expense-form__field expense-form__field--full">
          <label>Title</label>
          <input
            type="text"
            placeholder="e.g. Grocery shopping"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="expense-form__field">
          <label>Amount (₹)</label>
          <input
            type="number"
            min="1"
            placeholder="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>

        <div className="expense-form__field">
          <label>Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="expense-form__field">
          <label>Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div className="expense-form__field expense-form__field--full">
          <label>Note (optional)</label>
          <input
            type="text"
            placeholder="Add a note..."
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>
      </div>

      <div className="expense-form__actions">
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn--primary">
          {editExpense
            ? "Update"
            : form.type === "income"
              ? "Add Income"
              : "Add Expense"}
        </button>
      </div>
    </form>
  );
}
