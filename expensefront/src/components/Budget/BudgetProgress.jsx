import { formatCurrency } from "../../utils/helpers";
import "./BudgetProgress.css";

export default function BudgetProgress({ category, spent, limit, percent, status }) {
  if (limit <= 0) return null;

  const barColor =
    status === "exceeded" ? "#ef4444" : status === "warning" ? "#f59e0b" : category.color;

  return (
    <div className={`budget-progress budget-progress--${status}`}>
      <div className="budget-progress__header">
        <div className="budget-progress__info">
          <span className="budget-progress__icon" style={{ background: `${category.color}18` }}>
            {category.icon}
          </span>
          <div>
            <p className="budget-progress__name">{category.name}</p>
            <p className="budget-progress__amounts">
              {formatCurrency(spent)} / {formatCurrency(limit)}
            </p>
          </div>
        </div>
        <span className={`budget-progress__badge budget-progress__badge--${status}`}>
          {status === "exceeded" ? "Over budget!" : `${percent}%`}
        </span>
      </div>
      <div className="budget-progress__track">
        <div
          className="budget-progress__fill"
          style={{
            width: `${Math.min(percent, 100)}%`,
            background: barColor,
          }}
        />
        {percent > 100 && (
          <div
            className="budget-progress__overflow"
            style={{ width: `${Math.min(percent - 100, 30)}%` }}
          />
        )}
      </div>
      {status === "exceeded" && (
        <p className="budget-progress__warning">
          ⚠️ You crossed your budget by {formatCurrency(spent - limit)}
        </p>
      )}
      {status === "warning" && (
        <p className="budget-progress__warning budget-progress__warning--soft">
          🔔 {100 - percent}% remaining — spend carefully
        </p>
      )}
    </div>
  );
}
