import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import BrandHeader from "../components/BrandHeader";
import "../styles/Login.css";

function Login() {
  const { setCargando, cargando } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    contrasenia: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombreUsuario.trim()) newErrors.nombreUsuario = "El usuario es obligatorio";
    if (!formData.contrasenia.trim()) newErrors.contrasenia = "La contraseña es obligatoria";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setError("");
    setLoading(true);
    setCargando();

    try {
      const payload = {
        nombreUsuario: formData.nombreUsuario,
        contrasenia: formData.contrasenia,
      };

      const response = await fetch("http://localhost:3000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error en login");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => {
        setCargando();
        navigate("/home");
      }, 600);
    } catch (err) {
      setError(err.message);
      setCargando();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <BrandHeader subtitle="Panel de Administración • Personal autorizado" />
        <h2>Acceso de Personal</h2>
        <p className="card-subtitle">
          Ingresa tus credenciales para continuar con las gestiones internas.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Usuario</span>
            <input
              type="text"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
              placeholder="Ingresa tu usuario"
              className={errors.nombreUsuario ? "input-error" : ""}
            />
            {errors.nombreUsuario && <span className="error-msg">{errors.nombreUsuario}</span>}
          </label>

          <label className="auth-field">
            <span>Contraseña</span>
            <input
              type="password"
              name="contrasenia"
              value={formData.contrasenia}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              className={errors.contrasenia ? "input-error" : ""}
            />
            {errors.contrasenia && <span className="error-msg">{errors.contrasenia}</span>}
          </label>

          {error && <div className="form-error">{error}</div>}

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Validando..." : "Iniciar sesión"}
          </button>

          <div className="form-spinner">
            {cargando && (
              <Spinner animation="border" role="status" size="sm">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
          </div>
        </form>

        <div className="auth-links">
          <button
            className="link-btn"
            type="button"
            onClick={() => navigate("/register")}
          >
            Registrar Personal
          </button>
          <button
            className="link-btn secondary"
            type="button"
            onClick={() => navigate("/ingreso")}
          >
            ← Volver al login de usuarios
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
