import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import BrandHeader from "../components/BrandHeader";
import "../styles/IngresoSocio.css";

function IngresoSocio() {
  const [dni, setDni] = useState("");
  const [status, setStatus] = useState("form"); // form | success | error
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorDni, setErrorDni] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!dni.trim()) {
      setErrorDni("El DNI es obligatorio");
      return;
    }

    setLoading(true);
    setStatus("form");
    setMessage("");

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

      setStatus("success");
      setMessage("¡Sesión iniciada exitosamente! Redirigiendo...");
      setTimeout(() => navigate("/panel-socio"), 1500);
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ingreso-page">
      <div className="ingreso-card">
        <BrandHeader
          variant="dumbbell"
          subtitle="Ingresa tu DNI para registrar asistencia"
        />

        {status === "success" ? (
          <div className="ingreso-status success">
            <div className="status-icon">✔</div>
            <h3>Acceso al Gimnasio</h3>
            <p>{message}</p>
            <button
              className="secondary-btn"
              type="button"
              onClick={() => navigate("/")}
            >
              ← Volver al inicio
            </button>
          </div>
        ) : (
          <form className="ingreso-form" onSubmit={handleSubmit}>
            <label>
              <span>DNI</span>
              <input
                type="text"
                value={dni}
                onChange={(e) => {
                  setDni(e.target.value);
                  if (errorDni) setErrorDni("");
                }}
                placeholder="Ingresa tu DNI sin puntos ni espacios"
                className={errorDni ? "input-error" : ""}
              />
              {errorDni && <span className="error-msg">{errorDni}</span>}
            </label>

            {status === "error" && (
              <div className="ingreso-alert error">{message}</div>
            )}

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar al Gimnasio"}
            </button>

            <div className="form-spinner">
              {loading && (
                <Spinner animation="border" role="status" size="sm">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
            </div>
          </form>
        )}

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
  );
}

export default IngresoSocio;

