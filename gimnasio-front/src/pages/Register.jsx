import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandHeader from "../components/BrandHeader";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    correoUsuario: "",
    telefonoUsuario: "",
    contrasenia: "",
    rol: "recepcionista",
  });
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ type: "", message: "" });
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/usuarios/system/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al registrar");
      }

      setFeedback({
        type: "success",
        message: "Registro exitoso. Redirigiendo al login...",
      });
      setTimeout(() => navigate("/login"), 1800);
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <BrandHeader subtitle="Panel de administración • Personal autorizado" />
        <h2>Registro de personal</h2>
        <p className="register-subtitle">
          
        </p>

        <form className="register-form" onSubmit={handleSubmit}>
          <label className="register-field">
            <span>Nombre de usuario</span>
            <input
              type="text"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
              placeholder="Nombre de usuario..."
              required
            />
          </label>

          <label className="register-field">
            <span>Email</span>
            <input
              type="email"
              name="correoUsuario"
              value={formData.correoUsuario}
              onChange={handleChange}
              placeholder="Email..."
              required
            />
          </label>

          <label className="register-field">
            <span>Teléfono</span>
            <input
              type="tel"
              name="telefonoUsuario"
              value={formData.telefonoUsuario}
              onChange={handleChange}
              placeholder="Teléfono..."
            />
          </label>

          <label className="register-field">
            <span>Contraseña</span>
            <input
              type="password"
              name="contrasenia"
              value={formData.contrasenia}
              onChange={handleChange}
              placeholder="Contraseña..."
              required
            />
          </label>

          <label className="register-field">
            <span>Rol</span>
            <select name="rol" value={formData.rol} onChange={handleChange}>
              <option value="recepcionista">Recepcionista</option>
              <option value="administrador">Administrador</option>
            </select>
          </label>

          {feedback.message && (
            <div className={`register-alert ${feedback.type}`}>
              {feedback.message}
            </div>
          )}

          <div className="register-actions">
            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Completar registro"}
            </button>
            <button
              className="secondary-btn"
              type="button"
              onClick={() => navigate("/login")}
            >
              Volver a Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
