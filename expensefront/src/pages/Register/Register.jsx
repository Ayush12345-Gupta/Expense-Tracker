import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api";
import "../Login/Auth.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await API.post("/auth/register", form);
      setSuccess(res.data.message || "Account created successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg" />
      <div className="auth-card">
        <div className="auth-card__header">
          <span className="auth-card__logo">₹</span>
          <h1>Create account</h1>
          <p>Start tracking your expenses today</p>
        </div>

        {error && <div className="auth-card__error">{error}</div>}
        {success && <div className="auth-card__success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form__field">
            <label>Full Name</label>
            <input
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="auth-form__field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="auth-form__field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
