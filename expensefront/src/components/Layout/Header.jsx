import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../Notifications/NotificationBell";
import "./Header.css";

const titles = {
  "/dashboard": "Dashboard",
  "/expenses": "Expenses",
  "/charts": "Analytics",
  "/budget": "Budget",
  "/alerts": "Alerts",
  "/categories": "Categories",
  "/profile": "Profile",
};

export default function Header() {
  const location = useLocation();
  const { logout } = useAuth();
  const title = titles[location.pathname] || "Expense Tracer";

  return (
    <header className="header">
      <div>
        <h2>{title}</h2>
        <p className="header__subtitle">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="header__actions">
        <NotificationBell />
        <button type="button" className="header__logout" onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  );
}
