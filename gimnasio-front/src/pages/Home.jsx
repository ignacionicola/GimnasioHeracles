import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandHeader from "../components/BrandHeader";
import "../styles/Home.css";


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

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <BrandHeader subtitle="Panel interno • Personal autorizado" />
        {console.log(user)}
        <h1>Hola {user?.nombre}!</h1>
        <p>
          Desde aquí podés registrar socios, controlar asistencias y gestionar
          beneficios.
        </p>

        <div className="user-chip">
          <div>
            <span>Rol</span>
            <strong>{user?.rol || "Usuario"}</strong>
          </div>
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

      <section className="dashboard-section">
        <div className="section-head">
          <div>
            <h2>Acciones rápidas</h2>
            <p>Atajos para gestionar socios, beneficios y asistencias.</p>
          </div>
        </div>
        <div className="action-grid">
          <article className="action-card">
            <h3>Panel de socios</h3>
            <p>Abre el panel para socios y registra asistencias.</p>
            <button onClick={() => navigate("/ingreso")}>Abrir panel</button>
          </article>

          <article className="action-card">
            <h3>Gestion de Usuarios</h3>
            <p>Abre el panel para gestionar usuarios y su pagos.</p>
            <button onClick={() => navigate("/usuario")}>
              Gestionar Usuarios
            </button>
          </article>

          <article className="action-card">
            <h3>Gestión de Beneficios</h3>
            <p>Administra los beneficios disponibles para los socios.</p>
            <button onClick={() => navigate("/beneficios")}>
              Gestionar Beneficios
            </button>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Home;
