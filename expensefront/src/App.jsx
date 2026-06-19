import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Expenses from "./pages/Expenses/Expenses";
import ChartsPage from "./pages/Charts/ChartsPage";
import Budget from "./pages/Budget/Budget";
import Alerts from "./pages/Alerts/Alerts";
import Categories from "./pages/Categories/Categories";
import Profile from "./pages/Profile/Profile";

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <ExpenseProvider>
              <Layout />
            </ExpenseProvider>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/charts" element={<ChartsPage />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
