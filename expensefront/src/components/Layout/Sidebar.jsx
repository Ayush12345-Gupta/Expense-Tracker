import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "◫" },
  { to: "/expenses", label: "Expenses", icon: "₹" },
  { to: "/charts", label: "Analytics", icon: "◔" },
  { to: "/budget", label: "Budget", icon: "◎" },
  { to: "/alerts", label: "Alerts", icon: "🔔" },
  { to: "/categories", label: "Categories", icon: "▦" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">₹</span>
        <div>
          <h1>Expense Tracer</h1>
          <p>Track smarter</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar__link${isActive ? " sidebar__link--active" : ""}`
            }
          >
            <span className="sidebar__icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <p>Your finances, organized.</p>
      </div>
    </aside>
  );
}
