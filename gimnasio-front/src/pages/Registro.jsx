import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Registro.css";

function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.dni.trim()) newErrors.dni = "El DNI es obligatorio";
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es obligatorio";
    if (!formData.email.trim()) newErrors.email = "El email es obligatorio";
    if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setFeedback({ type: "", message: "" });
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al registrar socio");
      }

      setFeedback({
        type: "success",
        message: "Socio registrado correctamente.",
      });
      setFormData({
        dni: "",
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
      });
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registrar-page">
      <div className="registrar-card">
        <h2>Registrar Socio</h2>
        <p className="registrar-subtitle">
          Carga los datos del nuevo socio para habilitar su acceso al gimnasio.
        </p>

        <form className="registrar-form" onSubmit={handleSubmit}>
          <label>
            <span>DNI</span>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              placeholder="Ingresa tu DNI"
              className={errors.dni ? "input-error" : ""}
            />
            {errors.dni && <span className="error-msg">{errors.dni}</span>}
          </label>

          <label>
            <span>Nombre</span>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingresa tu nombre"
              className={errors.nombre ? "input-error" : ""}
            />
            {errors.nombre && <span className="error-msg">{errors.nombre}</span>}
          </label>

          <label>
            <span>Apellido</span>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Ingresa tu apellido"
              className={errors.apellido ? "input-error" : ""}
            />
            {errors.apellido && <span className="error-msg">{errors.apellido}</span>}
          </label>

          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingresa tu email"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </label>

          <label>
            <span>Teléfono</span>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ingresa tu teléfono"
              className={errors.telefono ? "input-error" : ""}
            />
            {errors.telefono && <span className="error-msg">{errors.telefono}</span>}
          </label>

          {feedback.message && (
            <div className={`registrar-alert ${feedback.type}`}>
              {feedback.message}
            </div>
          )}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Registrando..." : "Registrar Socio"}
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/home")}
          >
            ← Volver
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registro;
