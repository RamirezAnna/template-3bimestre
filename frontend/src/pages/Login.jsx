import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getApiErrorMessage } from "../services/api.js";
import { saveToken } from "../services/auth.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError("Informe seu email e sua senha.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", {
        email: normalizedEmail,
        password,
      });

      if (!data.token) {
        throw new Error("A API não retornou um token de acesso.");
      }

      saveToken(data.token);
      navigate("/protegida", { replace: true });
    } catch (error) {
      setError(getApiErrorMessage(error, error.message || "Não foi possível entrar."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand-mark" aria-hidden="true">A</div>
        <p className="eyebrow">Área do aluno</p>
        <h1 className="page-title">Bem-vindo de volta</h1>
        <p className="page-subtitle">Entre para acessar seu espaço protegido.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="field-group">
            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Digite sua senha" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>

          {error && <p role="alert" className="feedback feedback-error">{error}</p>}

          <button type="submit" disabled={loading} className="primary-button">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="form-footer">
          Ainda não tem conta? <Link to="/register">Criar conta</Link>
        </p>
      </section>
    </main>
  );
}
