import { useState } from "react";
import { useExpenses } from "../../context/ExpenseContext";
import { formatCurrency } from "../../utils/helpers";
import ExpenseForm from "../../components/ExpenseForm/ExpenseForm";
import ExpenseList from "../../components/ExpenseList/ExpenseList";
import "./Expenses.css";

export default function Expenses() {
  const { expenseItems, categories } = useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filtered = expenseItems.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || e.categoryId === filterCategory;
    return matchSearch && matchCat;
  });

  const total = filtered.reduce((sum, e) => sum + Number(e.amount), 0);

  const handleEdit = (expense) => {
    setEditExpense(expense);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditExpense(null);
  };

  return (
    <div className="expenses-page">
      <div className="expenses-page__toolbar">
        <div className="expenses-page__search">
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            setEditExpense(null);
            setShowForm(true);
          }}
        >
          + Add Expense
        </button>
      </div>

      <div className="expenses-page__summary">
        <span>{filtered.length} expenses</span>
        <strong>Total: {formatCurrency(total)}</strong>
      </div>

      {showForm && (
        <div className="expenses-page__modal-overlay" onClick={handleClose}>
          <div className="expenses-page__modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editExpense ? "Edit Expense" : "New Expense"}</h3>
            <ExpenseForm
              editExpense={editExpense}
              onSuccess={handleClose}
              onCancel={handleClose}
            />
          </div>
        </div>
      )}

      <ExpenseList expenses={filtered} onEdit={handleEdit} />
    </div>
  );
}
