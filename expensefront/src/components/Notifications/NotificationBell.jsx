import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useExpenses } from "../../context/ExpenseContext";
import "./NotificationBell.css";

export default function NotificationBell() {
  const { alerts, dismissAlert, clearDismissedAlerts } = useExpenses();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dangerCount = alerts.filter((a) => a.type === "danger").length;

  return (
    <div className="notif-bell" ref={ref}>
      <button
        type="button"
        className="notif-bell__btn"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        🔔
        {alerts.length > 0 && (
          <span className={`notif-bell__badge${dangerCount > 0 ? " notif-bell__badge--danger" : ""}`}>
            {alerts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="notif-bell__dropdown">
          <div className="notif-bell__dropdown-header">
            <h4>Alerts</h4>
            {alerts.length > 0 && (
              <button type="button" onClick={clearDismissedAlerts}>
                Reset
              </button>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="notif-bell__empty">
              <span>✅</span>
              <p>All clear! No alerts right now.</p>
            </div>
          ) : (
            <div className="notif-bell__list">
              {alerts.map((alert) => (
                <div key={alert.id} className={`notif-bell__item notif-bell__item--${alert.type}`}>
                  <div className="notif-bell__item-content">
                    <strong>{alert.title}</strong>
                    <p>{alert.message}</p>
                  </div>
                  <button
                    type="button"
                    className="notif-bell__dismiss"
                    onClick={() => dismissAlert(alert.id)}
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <Link to="/alerts" className="notif-bell__footer" onClick={() => setOpen(false)}>
            View all alerts & settings →
          </Link>
        </div>
      )}
    </div>
  );
}
