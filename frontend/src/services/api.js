import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export function getApiErrorMessage(error, fallback) {
  return (
    error.response?.data?.message ||
    error.response?.data?.mensagem ||
    (error.request ? "Não foi possível conectar ao servidor" : fallback)
  );
}

export default api;
