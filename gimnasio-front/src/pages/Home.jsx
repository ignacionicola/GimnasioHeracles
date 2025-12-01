import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BrandHeader from "../components/BrandHeader";
import "../styles/Home.css";

const ACTIONS = [
  {
    key: "register-socio",
    title: "Registrar nuevo socio",
    description: "Carga DNI, datos personales y habilita el acceso.",
    cta: "Ir a Registro",
    target: "/registro",
    roles: ["recepcionista", "administrador"],
  },
  {
    key: "panel-socio",
    title: "Panel de socios",
    description: "Abre el panel para socios y registra asistencias.",
    cta: "Abrir panel",
    target: "/ingreso",
    roles: ["recepcionista", "administrador"],
  },
  {
    key: "logout",
    title: "Cerrar sesión segura",
    description: "Finaliza tu sesión actual y libera el puesto.",
    cta: "Cerrar sesión",
    action: "logout",
    roles: ["recepcionista", "administrador"],
  },
];

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/usuarios/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const quickActions = useMemo(() => {
    if (!user?.rol) return [];
    return ACTIONS.filter((action) => action.roles.includes(user.rol));
  }, [user]);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <BrandHeader subtitle="Panel interno • Personal autorizado" />
        <h1>
          Hola{" "}
          {user?.nombreUsuario ||
            user?.nombre ||
            "Recepcionista"}{" "}
          👋
        </h1>
        <p>
          Desde aquí podés registrar socios, controlar asistencias y mantener el
          club funcionando como en los mockups del proyecto.
        </p>

        <div className="user-chip">
          <div>
            <span>Rol</span>
            <strong>{user?.rol || "Usuario"}</strong>
          </div>
          {user?.dni && (
            <div>
              <span>DNI</span>
              <strong>{user.dni}</strong>
            </div>
          )}
          {user?.correoUsuario && (
            <div>
              <span>Correo</span>
              <strong>{user.correoUsuario}</strong>
            </div>
          )}
          <button className="ghost-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {quickActions.length > 0 && (
        <section className="dashboard-section">
          <div className="section-head">
            <div>
              <h2>Acciones rápidas</h2>
              <p>
                Atajos pensados para la recepción: alta de socios y acceso al
                kiosco de asistencias.
              </p>
            </div>
          </div>

          <div className="action-grid">
            {quickActions.map((action) => (
              <article key={action.key} className="action-card">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <button
                  onClick={() =>
                    action.action === "logout"
                      ? handleLogout()
                      : navigate(action.target)
                  }
                >
                  {action.cta}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
