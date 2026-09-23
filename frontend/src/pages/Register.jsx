import { useState } from "react";
import { Link } from "react-router-dom";
import api, { getApiErrorMessage } from "../services/api.js";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedName || !normalizedEmail || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", {
        name: normalizedName,
        email: normalizedEmail,
        password,
      });
      setSuccess("Cadastro realizado com sucesso");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(getApiErrorMessage(error, "Não foi possível criar sua conta."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand-mark" aria-hidden="true">A</div>
        <p className="eyebrow">Comece agora</p>
        <h1 className="page-title">Crie sua conta</h1>
        <p className="page-subtitle">Leva menos de um minuto para começar.</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="field-group">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Como podemos chamar você?"
            />
          </div>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@exemplo.com"
            />
          </div>
          <div className="field-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo de 6 caracteres"
            />
          </div>

          {error && <p role="alert" className="feedback feedback-error">{error}</p>}
          {success && <p role="status" className="feedback feedback-success">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="primary-button"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="form-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}
