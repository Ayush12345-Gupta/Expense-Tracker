import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useExpenses } from "../../context/ExpenseContext";
import { formatCurrency, getMonthKey, getMonthLabel } from "../../utils/helpers";
import "./Charts.css";

export default function Charts({ variant = "full" }) {
  const { expenses, categories } = useExpenses();

  const categoryData = categories
    .map((cat) => {
      const total = expenses
        .filter((e) => e.categoryId === cat.id)
        .reduce((sum, e) => sum + Number(e.amount), 0);
      return { name: cat.name, value: total, color: cat.color };
    })
    .filter((d) => d.value > 0);

  const monthMap = {};
  expenses.forEach((e) => {
    const key = getMonthKey(e.date);
    monthMap[key] = (monthMap[key] || 0) + Number(e.amount);
  });

  const monthlyData = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, amount]) => ({
      month: getMonthLabel(key),
      amount,
    }));

  if (expenses.length === 0) {
    return (
      <div className="charts__empty">
        <span>📊</span>
        <p>No data to visualize yet</p>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="charts charts--compact">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {categoryData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="charts">
      <div className="charts__card">
        <h3>Spending by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
        <div className="charts__legend">
          {categoryData.map((d) => (
            <div key={d.name} className="charts__legend-item">
              <span style={{ background: d.color }} />
              {d.name}: {formatCurrency(d.value)}
            </div>
          ))}
        </div>
      </div>

      <div className="charts__card">
        <h3>Monthly Trend</h3>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="amount" name="Spent" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="charts__empty charts__empty--small">Not enough monthly data</div>
        )}
      </div>

      <div className="charts__card charts__card--full">
        <h3>Top Categories</h3>
        <div className="charts__bars">
          {categoryData
            .sort((a, b) => b.value - a.value)
            .map((d) => {
              const max = categoryData[0]?.value || 1;
              return (
                <div key={d.name} className="charts__bar-row">
                  <span className="charts__bar-label">{d.name}</span>
                  <div className="charts__bar-track">
                    <div
                      className="charts__bar-fill"
                      style={{
                        width: `${(d.value / max) * 100}%`,
                        background: d.color,
                      }}
                    />
                  </div>
                  <span className="charts__bar-value">{formatCurrency(d.value)}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export function CategoryBreakdown() {
  const { expenses, categories } = useExpenses();
  const top = categories
    .map((cat) => ({
      ...cat,
      total: expenses
        .filter((e) => e.categoryId === cat.id)
        .reduce((sum, e) => sum + Number(e.amount), 0),
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  if (top.length === 0) return null;

  return (
    <div className="category-breakdown">
      {top.map((cat) => (
        <div key={cat.id} className="category-breakdown__item">
          <span style={{ background: `${cat.color}20`, color: cat.color }}>
            {cat.icon}
          </span>
          <div>
            <p>{cat.name}</p>
            <strong>{formatCurrency(cat.total)}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}
