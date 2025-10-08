import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [dni, setDni] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post(
        "http://localhost:3000/api/usuarios/register",
        { dni }
      );
      setMsg("¡DNI registrado correctamente!");
    } catch (err) {
      setMsg("Error al registrar: " + (err.response?.data?.error || "Desconocido"));
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Registrate en el gimnasio</h1>
      <div className="login-card">
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
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}