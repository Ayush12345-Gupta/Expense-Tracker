import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import { DEFAULT_CATEGORIES } from "../utils/categories";
import {
  generateAlerts,
  getBudgetStatus,
  isCurrentMonth,
} from "../utils/analytics";

const ExpenseContext = createContext(null);

function storageKey(userId, type) {
  return `expense_tracer_${userId}_${type}`;
}

export function ExpenseProvider({ children }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [budgets, setBudgets] = useState({});
  const [monthlyIncome, setMonthlyIncomeState] = useState(0);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    emailEnabled: false,
    email: "",
    browserEnabled: true,
  });

  useEffect(() => {
    if (!user?.id) {
      setExpenses([]);
      setCategories(DEFAULT_CATEGORIES);
      setBudgets({});
      setMonthlyIncomeState(0);
      setDismissedAlerts([]);
      return;
    }

    const load = (key, fallback) => {
      const raw = localStorage.getItem(storageKey(user.id, key));
      return raw ? JSON.parse(raw) : fallback;
    };

    setExpenses(load("expenses", []));
    setCategories(load("categories", DEFAULT_CATEGORIES));
    setBudgets(load("budgets", {}));
    setMonthlyIncomeState(load("monthlyIncome", 0));
    setDismissedAlerts(load("dismissedAlerts", []));
    setNotificationSettings(
      load("notificationSettings", {
        emailEnabled: false,
        email: "",
        browserEnabled: true,
      })
    );
  }, [user?.id]);

  const persist = useCallback(
    (key, data) => {
      if (user?.id) {
        localStorage.setItem(storageKey(user.id, key), JSON.stringify(data));
      }
    },
    [user?.id]
  );

  const addExpense = (expense) => {
    const newExpense = {
      type: "expense",
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => {
      const updated = [newExpense, ...prev];
      persist("expenses", updated);
      return updated;
    });
  };

  const updateExpense = (id, updates) => {
    setExpenses((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...updates } : e));
      persist("expenses", updated);
      return updated;
    });
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      persist("expenses", updated);
      return updated;
    });
  };

  const addCategory = (category) => {
    const newCat = { ...category, id: crypto.randomUUID() };
    setCategories((prev) => {
      const updated = [...prev, newCat];
      persist("categories", updated);
      return updated;
    });
  };

  const deleteCategory = (id) => {
    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      persist("categories", updated);
      return updated;
    });
    setBudgets((prev) => {
      const updated = { ...prev };
      delete updated[id];
      persist("budgets", updated);
      return updated;
    });
  };

  const setBudget = (categoryId, amount) => {
    setBudgets((prev) => {
      const updated = { ...prev, [categoryId]: Number(amount) || 0 };
      persist("budgets", updated);
      return updated;
    });
  };

  const setMonthlyIncome = (amount) => {
    const val = Number(amount) || 0;
    setMonthlyIncomeState(val);
    persist("monthlyIncome", val);
  };

  const updateNotificationSettings = (updates) => {
    setNotificationSettings((prev) => {
      const updated = { ...prev, ...updates };
      persist("notificationSettings", updated);
      return updated;
    });
  };

  const dismissAlert = (alertId) => {
    setDismissedAlerts((prev) => {
      const updated = [...new Set([...prev, alertId])];
      persist("dismissedAlerts", updated);
      return updated;
    });
  };

  const clearDismissedAlerts = () => {
    setDismissedAlerts([]);
    persist("dismissedAlerts", []);
  };

  const expenseItems = expenses.filter((e) => e.type !== "income");
  const incomeItems = expenses.filter((e) => e.type === "income");

  const totalSpent = expenseItems.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalIncome = incomeItems.reduce((sum, e) => sum + Number(e.amount), 0);

  const thisMonthExpenses = expenseItems.filter((e) => isCurrentMonth(e.date));
  const thisMonthIncome = incomeItems.filter((e) => isCurrentMonth(e.date));

  const monthlyTotal = thisMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const monthlyIncomeTotal =
    thisMonthIncome.reduce((sum, e) => sum + Number(e.amount), 0) + monthlyIncome;

  const budgetStatuses = useMemo(
    () => getBudgetStatus(categories, expenses, budgets),
    [categories, expenses, budgets]
  );

  const alerts = useMemo(
    () =>
      generateAlerts({
        expenses,
        categories,
        budgets,
        monthlyIncome: monthlyIncome + thisMonthIncome.reduce((sum, e) => sum + Number(e.amount), 0),
        dismissedIds: dismissedAlerts,
      }),
    [expenses, categories, budgets, monthlyIncome, thisMonthIncome, dismissedAlerts]
  );

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        expenseItems,
        incomeItems,
        categories,
        budgets,
        monthlyIncome,
        monthlyIncomeTotal,
        notificationSettings,
        alerts,
        budgetStatuses,
        addExpense,
        updateExpense,
        deleteExpense,
        addCategory,
        deleteCategory,
        setBudget,
        setMonthlyIncome,
        updateNotificationSettings,
        dismissAlert,
        clearDismissedAlerts,
        totalSpent,
        totalIncome,
        monthlyTotal,
        thisMonthExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error("useExpenses must be used within ExpenseProvider");
  return ctx;
}
