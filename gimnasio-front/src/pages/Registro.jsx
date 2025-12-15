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
    plan: "",
  });
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validación en tiempo real sin bloquear la entrada:
    if (name === "dni") {
      if (value && /\D/.test(value)) {
        setErrors((prev) => ({ ...prev, dni: "No se permiten letras o símbolos" }));
      } else if (value && value.trim().length > 0 && value.trim().length < 8) {
        setErrors((prev) => ({ ...prev, dni: "Mínimo 8 dígitos" }));
      } else {
        setErrors((prev) => ({ ...prev, dni: null }));
      }
      return;
    }

    if (name === "telefono") {
      if (value && /\D/.test(value)) {
        setErrors((prev) => ({ ...prev, telefono: "No se permiten letras o símbolos" }));
      } else if (value && value.trim().length > 0 && value.trim().length < 8) {
        setErrors((prev) => ({ ...prev, telefono: "Mínimo 8 dígitos" }));
      } else {
        setErrors((prev) => ({ ...prev, telefono: null }));
      }
      return;
    }

    if (name === "nombre") {
      if (value && /\d/.test(value)) {
        setErrors((prev) => ({ ...prev, nombre: "No se permiten números" }));
      } else if (value && value.trim().length > 0 && value.trim().length < 4) {
        setErrors((prev) => ({ ...prev, nombre: "Mínimo 4 letras" }));
      } else {
        setErrors((prev) => ({ ...prev, nombre: null }));
      }
      return;
    }

    if (name === "apellido") {
      if (value && /\d/.test(value)) {
        setErrors((prev) => ({ ...prev, apellido: "No se permiten números" }));
      } else if (value && value.trim().length > 0 && value.trim().length < 5) {
        setErrors((prev) => ({ ...prev, apellido: "Mínimo 5 letras" }));
      } else {
        setErrors((prev) => ({ ...prev, apellido: null }));
      }
      return;
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.dni.trim()) newErrors.dni = "El DNI es obligatorio";
    else if (!/^\d+$/.test(formData.dni)) newErrors.dni = "No se permiten letras o símbolos en el DNI";
    
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(formData.nombre)) newErrors.nombre = "No se permiten números en el nombre";
    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es obligatorio";
    else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(formData.apellido)) newErrors.apellido = "No se permiten números en el apellido";
    if (!formData.email.trim()) newErrors.email = "El email es obligatorio";
    if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio";
    else if (!/^\d+$/.test(formData.telefono)) newErrors.telefono = "No se permiten letras o símbolos en el teléfono";
    if (!formData.plan) newErrors.plan = "Selecciona un plan";

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
        plan: "",
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

        <form className="registrar-form" onSubmit={handleSubmit} noValidate>
          <label>
            <span>DNI</span>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              placeholder="Ingresa tu DNI"
              className={errors.dni ? "input-error" : ""}
              inputMode="numeric"
              pattern="\\d*"
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
              pattern="[A-Za-zÀ-ÿ\s]+"
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
              inputMode="numeric"
              pattern="\\d*"
            />
            {errors.telefono && <span className="error-msg">{errors.telefono}</span>}
          </label>

          <label className="plan-group">
            <span>Plan</span>
            <select
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              className={errors.plan ? "input-error plan-select" : "plan-select"}
            >
              <option value="">-- Selecciona un plan --</option>
              <option value="basico">Básico</option>
              <option value="medio">Medio</option>
              <option value="libre">Libre</option>
            </select>
            {errors.plan && <span className="error-msg">{errors.plan}</span>}
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
