import { useState } from "react";
import { api, saveToken } from "../api.js";

export default function Register({ onLoggedIn, goToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.register(name, email, password);
      saveToken(data.token);
      onLoggedIn(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Crear cuenta</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña (mín. 6 caracteres)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creando..." : "Crear cuenta"}
      </button>
      <p>
        ¿Ya tienes cuenta?{" "}
        <button type="button" className="link" onClick={goToLogin}>
          Inicia sesión
        </button>
      </p>
    </form>
  );
}