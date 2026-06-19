import { useAuth } from "../../context/AuthContext";
import { useExpenses } from "../../context/ExpenseContext";
import { formatCurrency } from "../../utils/helpers";
import "./Profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const { expenses, categories, totalSpent, monthlyTotal } = useExpenses();

  return (
    <div className="profile-page">
      <div className="profile-page__hero">
        <div className="profile-page__avatar">
          <span>👤</span>
        </div>
        <div>
          <h3>User #{user?.id}</h3>
          <p>Expense Tracer member</p>
        </div>
      </div>

      <div className="profile-page__stats">
        <div className="profile-page__stat">
          <span>Total Expenses</span>
          <strong>{expenses.length}</strong>
        </div>
        <div className="profile-page__stat">
          <span>Categories</span>
          <strong>{categories.length}</strong>
        </div>
        <div className="profile-page__stat">
          <span>All-time Spent</span>
          <strong>{formatCurrency(totalSpent)}</strong>
        </div>
        <div className="profile-page__stat">
          <span>This Month</span>
          <strong>{formatCurrency(monthlyTotal)}</strong>
        </div>
      </div>

      <div className="profile-page__section">
        <h4>Account</h4>
        <div className="profile-page__row">
          <span>User ID</span>
          <strong>#{user?.id}</strong>
        </div>
        <div className="profile-page__row">
          <span>Data Storage</span>
          <strong>Local (browser)</strong>
        </div>
        <div className="profile-page__row">
          <span>Authentication</span>
          <strong>JWT via backend</strong>
        </div>
      </div>

      <button type="button" className="btn btn--danger btn--full" onClick={logout}>
        Sign out of account
      </button>
    </div>
  );
}
