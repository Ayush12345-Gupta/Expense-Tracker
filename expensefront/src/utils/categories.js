export const DEFAULT_CATEGORIES = [
  { id: "food", name: "Food & Dining", color: "#f97316", icon: "🍔" },
  { id: "transport", name: "Transport", color: "#3b82f6", icon: "🚗" },
  { id: "shopping", name: "Shopping", color: "#ec4899", icon: "🛍️" },
  { id: "bills", name: "Bills & Utilities", color: "#8b5cf6", icon: "📄" },
  { id: "entertainment", name: "Entertainment", color: "#14b8a6", icon: "🎬" },
  { id: "health", name: "Health", color: "#22c55e", icon: "💊" },
  { id: "other", name: "Other", color: "#64748b", icon: "📦" },
];

export function getCategoryById(id, categories = DEFAULT_CATEGORIES) {
  return categories.find((c) => c.id === id) || categories[categories.length - 1];
}
