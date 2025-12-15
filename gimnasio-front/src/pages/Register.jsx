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
    if (feedback.message) setFeedback({ type: "", message: "" });
  };

  const validateForm = () => {
    if (!formData.nombreUsuario.trim()) {
      setFeedback({ type: "error", message: "El usuario es obligatorio" });
      return false;
    }
    if (!formData.correoUsuario.trim()) {
      setFeedback({ type: "error", message: "El email es obligatorio" });
      return false;
    }
    if (!formData.contrasenia.trim()) {
      setFeedback({ type: "error", message: "La contraseña es obligatoria" });
      return false;
    }
    if (formData.contrasenia.trim().length < 6) {
      setFeedback({ type: "error", message: "La contraseña debe tener al menos 6 caracteres" });
      return false;
    }
    if (!formData.telefonoUsuario.trim()) {
      setFeedback({ type: "error", message: "El teléfono es obligatorio" });
      return false;
    }
    if (!/^\d{6,}$/.test(formData.telefonoUsuario.trim())) {
      setFeedback({ type: "error", message: "Ingrese un teléfono válido (solo dígitos, mínimo 6)" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

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
        const data = await response.json().catch(() => null);
        if (data && Array.isArray(data.details)) {
          const errorMsg = data.details.map((e) => e.msg || e).join(", ");
          setFeedback({ type: "error", message: errorMsg });
          return;
        }
        setFeedback({ type: "error", message: (data && (data.error || data.message)) || "Error al registrar" });
        return;
      }

      setFeedback({ type: "success", message: "Registro exitoso. Redirigiendo al login..." });
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
          Completa los datos para crear una nueva cuenta de personal.
        </p>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <label className="register-field">
            <span>Nombre de usuario</span>
            <input
              type="text"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
              placeholder="Nombre de usuario..."
              className={feedback.type === "error" ? "input-error" : ""}
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
              className={feedback.type === "error" ? "input-error" : ""}
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
              className={feedback.type === "error" ? "input-error" : ""}
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
              className={feedback.type === "error" ? "input-error" : ""}
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