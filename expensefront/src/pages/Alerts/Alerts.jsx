import { useExpenses } from "../../context/ExpenseContext";
import "./Alerts.css";

export default function Alerts() {
  const {
    alerts,
    dismissAlert,
    clearDismissedAlerts,
    notificationSettings,
    updateNotificationSettings,
  } = useExpenses();

  const requestBrowserPermission = async () => {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      updateNotificationSettings({ browserEnabled: true });
    }
  };

  return (
    <div className="alerts-page">
      <div className="alerts-page__settings">
        <h3>🔔 Notification Settings</h3>
        <div className="alerts-page__setting">
          <div>
            <strong>Browser notifications</strong>
            <p>Get instant alerts when budgets are exceeded</p>
          </div>
          <label className="alerts-page__toggle">
            <input
              type="checkbox"
              checked={notificationSettings.browserEnabled}
              onChange={(e) => {
                if (e.target.checked) requestBrowserPermission();
                else updateNotificationSettings({ browserEnabled: false });
              }}
            />
            <span />
          </label>
        </div>

        <div className="alerts-page__setting">
          <div>
            <strong>Email notifications</strong>
            <p>Receive budget alerts via email (optional)</p>
          </div>
          <label className="alerts-page__toggle">
            <input
              type="checkbox"
              checked={notificationSettings.emailEnabled}
              onChange={(e) =>
                updateNotificationSettings({ emailEnabled: e.target.checked })
              }
            />
            <span />
          </label>
        </div>

        {notificationSettings.emailEnabled && (
          <div className="alerts-page__email">
            <input
              type="email"
              placeholder="your@email.com"
              value={notificationSettings.email}
              onChange={(e) => updateNotificationSettings({ email: e.target.value })}
            />
            <p className="alerts-page__email-note">
              📧 Email delivery requires backend setup. Alerts are saved in-app for now.
            </p>
          </div>
        )}
      </div>

      <div className="alerts-page__list-section">
        <div className="alerts-page__list-header">
          <h3>Active Alerts ({alerts.length})</h3>
          {alerts.length > 0 && (
            <button type="button" className="btn btn--ghost" onClick={clearDismissedAlerts}>
              Show dismissed again
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="alerts-page__empty">
            <span>✅</span>
            <h4>No active alerts</h4>
            <p>Your spending is within budget. Keep it up!</p>
          </div>
        ) : (
          <div className="alerts-page__list">
            {alerts.map((alert) => (
              <div key={alert.id} className={`alerts-page__card alerts-page__card--${alert.type}`}>
                <div className="alerts-page__card-icon">
                  {alert.type === "danger" ? "🚨" : alert.type === "warning" ? "⚠️" : "ℹ️"}
                </div>
                <div className="alerts-page__card-body">
                  <strong>{alert.title}</strong>
                  <p>{alert.message}</p>
                </div>
                <button
                  type="button"
                  className="alerts-page__dismiss"
                  onClick={() => dismissAlert(alert.id)}
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="alerts-page__types">
        <h4>Alert types we monitor</h4>
        <ul>
          <li>🚨 <strong>Budget exceeded</strong> — when spending crosses category limit</li>
          <li>⚠️ <strong>Budget warning</strong> — at 80% of your budget</li>
          <li>💸 <strong>High spending</strong> — single expense above ₹5,000</li>
          <li>📈 <strong>Weekly spike</strong> — spending 50%+ higher than last week</li>
          <li>💰 <strong>Income exceeded</strong> — monthly expenses exceed income</li>
        </ul>
      </div>
    </div>
  );
}
