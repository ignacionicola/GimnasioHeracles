import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandHeader from "../components/BrandHeader";
import "../styles/PanelSocio.css";

function PanelSocio() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/ingreso");
      return;
    }
    setUsuario(JSON.parse(user));
  }, [navigate]);

  return (
    <div className="panel-socio-page">
      <div className="panel-socio-card">
        <BrandHeader variant="gift" subtitle="Programa de puntos Heracles" />

        <div className="panel-greeting">
          <h2>¡Hola {usuario?.nombre || "Juan Pérez"}!</h2>
          <span className="points-badge">
            {usuario?.puntos ?? 125} puntos disponibles
          </span>
        </div>

        <p className="panel-question">¿Qué te gustaría hacer hoy?</p>

        <div className="panel-actions">
          <button className="panel-btn primary">Ver Recompensas y Menú</button>
          <button className="panel-btn ghost">Solo Registrar Asistencia</button>
        </div>

        <p className="panel-note">
          Si solo registras asistencia, ganarás +10 puntos automáticamente.
        </p>

        <button className="link-btn secondary" onClick={() => navigate("/")}>
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default PanelSocio;

