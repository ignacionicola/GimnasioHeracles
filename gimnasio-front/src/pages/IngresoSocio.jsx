import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandHeader from "../components/BrandHeader";
import "../styles/IngresoSocio.css";

function IngresoSocio() {
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!dni.trim()) {
      setErrorMessage("El DNI es obligatorio");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:3000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dni }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "DNI inválido");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccessMessage("¡Sesión iniciada exitosamente! Redirigiendo...");
      setTimeout(() => navigate("/panel-socio"), 1500);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de inicio si pasa
  if (successMessage) {
    return (
      <div className="ingreso-page">
        <div className="ingreso-card">
          <BrandHeader
            variant="dumbbell"
            subtitle="Ingresa tu DNI para registrar asistencia"
          />
          <div className="ingreso-status success">
            <div className="status-icon">✔</div>
            <h3>Acceso al Gimnasio</h3>
            <p>{successMessage}</p>
            <button
              className="secondary-btn"
              type="button"
              onClick={() => navigate("/panel-socio")}
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ingreso-page">
      <div className="ingreso-card">
        <BrandHeader
          variant="dumbbell"
          subtitle="Ingresa tu DNI para registrar asistencia"
        />
 <div className="ingreso-content">
        <form className="ingreso-form" onSubmit={handleSubmit}>
          <label>
            <span>DNI</span>
            <input
              type="text"
              value={dni}
              onChange={(e) => {
                setDni(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="Ingresa tu DNI sin puntos ni espacios"
              className={errorMessage ? "input-error" : ""}
            />
            {errorMessage && <span className="error-msg">{errorMessage}</span>}
          </label>

          {errorMessage && (
            <div className="ingreso-alert error">{errorMessage}</div>
          )}

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar al Gimnasio"}
          </button>
        </form>

        <div className="ingreso-links">
          <button
            className="link-btn secondary"
            type="button"
            onClick={() => navigate("/login")}
          >
            Acceso de personal autorizado
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default IngresoSocio;
