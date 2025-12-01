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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
              required
            />
          </label>

          <label>
            <span>Nombre</span>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingresa tu nombre"
              required
            />
          </label>

          <label>
            <span>Apellido</span>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Ingresa tu apellido"
              required
            />
          </label>

          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingresa tu email"
              required
            />
          </label>

          <label>
            <span>Teléfono</span>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ingresa tu teléfono"
            />
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
