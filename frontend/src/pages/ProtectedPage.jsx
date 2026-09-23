import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getApiErrorMessage } from "../services/api.js";
import { getToken, removeToken } from "../services/auth.js";

export default function ProtectedPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function loadProfile() {
    const token = getToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user);
      setError("");
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        removeToken();
        navigate("/login", { replace: true });
        return;
      }
      setError(getApiErrorMessage(requestError, "Não foi possível carregar seu perfil."));
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    removeToken();
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    // Este efeito prepara o carregamento do perfil quando a página abre.
    // Após completar loadProfile, a requisição acontecerá aqui.
    loadProfile();
  }, []);

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Sessão ativa</p>
            <h1 className="page-title">Seu perfil</h1>
          </div>
          <button type="button" onClick={handleLogout} className="secondary-button">Sair</button>
        </div>
        <p role="status" className="feedback feedback-success">Login realizado com sucesso</p>

        {loading && <p role="status" className="loading-message">Carregando perfil...</p>}
        {error && <p role="alert" className="feedback feedback-error">{error}</p>}

        <div className="profile-details">
          <h2>Dados do usuário</h2>
          <p><span>ID</span>{user?.id ?? "Aguardando perfil"}</p>
          <p><span>Nome</span>{user?.name ?? "Aguardando perfil"}</p>
          <p><span>Email</span>{user?.email ?? "Aguardando perfil"}</p>
        </div>
      </section>
    </main>
  );
}
