import "./StatCard.css";

export default function StatCard({ label, value, icon, trend, variant = "default" }) {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <div className="stat-card__top">
        <span className="stat-card__icon">{icon}</span>
        {trend && <span className="stat-card__trend">{trend}</span>}
      </div>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
    </div>
  );
}
