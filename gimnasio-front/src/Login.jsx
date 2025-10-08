import { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [dni, setDni] = useState("");
  const [msg, setMsg] = useState("");
  const [pantalla, setPantalla] = useState("login");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post(
        "http://localhost:3000/api/usuarios/login",
        { dni },
        { withCredentials: true }
      );
      setPantalla("redirigiendo");
      setTimeout(() => {
        setPantalla("hola");
      }, 2000);
    } catch (err) {
      setMsg("Error al iniciar sesión: " + (err.response?.data?.error || "Desconocido"));
    }
  };

  // Pantalla de carga después del login
  if (pantalla === "redirigiendo") {
    return (
      <div className="login-container">
        <div className="login-card text-center">
          <h3 className="text-success mb-3">¡Sesión iniciada exitosamente!</h3>
          <p>Redirigiendo...</p>
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  // Pantalla de bienvenida y menú
  if (pantalla === "hola") {
    return (
      <div className="login-container">
        <div className="login-card text-center">
          <h3>¡Hola Tienes!</h3>
          <span className="badge bg-warning text-dark mb-3">
            900 puntos disponibles
          </span>
          <p>¡Bienvenido al sistema de recompensas!</p>

          <button
            className="btn btn-success w-100 mb-2"
            onClick={() => navigate("/")}
          >
            Ver Recompensas y Menú
          </button>

          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate("/")}
          >
            Solo Registrar Asistencia
          </button>

          <p className="small text-muted mt-2">
            Si solo registras asistencia ganarás +10 puntos automáticamente
          </p>
        </div>
      </div>
    );
  }

  // Formulario de login
  return (
    <div className="login-container">
      <h1 className="login-title">Heracles Gym</h1>
      <div className="login-card">
        <h3 className="text-center mb-4">Acceso al Gimnasio</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>DNI</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingresa tu DNI"
              value={dni}
              onChange={e => setDni(e.target.value)}
              required
            />
          </div>
          {msg && <div className="alert alert-danger">{msg}</div>}
          <button type="submit" className="btn btn-success w-100 mb-3">
            Ingresar al Gimnasio
          </button>
          <p className="small text-muted">
            Si no tienes cuenta comunicate con recepción
          </p>
        </form>
      </div>
    </div>
  );
}