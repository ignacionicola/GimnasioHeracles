import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [plan, setPlan] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await axios.post(
        "http://localhost:3000/api/usuarios/register",
        { dni, nombre, apellido, email, telefono, plan }
      );
      setMsg("¡Usuario registrado correctamente!");
      setDni(""); setNombre(""); setApellido(""); setEmail(""); setTelefono(""); setPlan("");
    } catch (err) {
      setMsg("Error al registrar: " + (err.response?.data?.error || "Desconocido"));
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Registrar Socio</h1>
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
          <div className="form-group mb-3">
            <label>Nombre</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingresa tu nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Apellido</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingresa tu apellido"
              value={apellido}
              onChange={e => setApellido(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Ingresa tu email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Teléfono</label>
            <input
              type="tel"
              className="form-control"
              placeholder="Ingresa tu teléfono"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
            />
          </div>
        
          <button type="submit" className="btn btn-success w-100 mb-3">
            Registrar Socio
          </button>
        </form>
        {msg && <div className="alert alert-danger">{msg}</div>}
      </div>
    </div>
  );
}