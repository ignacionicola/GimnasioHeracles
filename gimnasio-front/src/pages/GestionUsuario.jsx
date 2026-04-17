import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandHeader from "../components/BrandHeader";

import "../styles/GestionUsuario.css";
import { getUsuarios } from "../service/usuarioService";

function GestionUsuario() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    getUsuarios()
      .then((data) => {
        setUsuarios(data || []);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  async function cargarUsuarios() {
    setCargando(true);
    try {
      const data = await getUsuarios();
      setUsuarios(Array.isArray(data) ? data : data.usuarios || data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  }

  /* metodo fetch mas o menos 
  async function fetchUsuarios() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/usuarios/socios",
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error("No se pudieron cargar los usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setUsuarios(usuariosMock);
    } finally {
      setLoading(false);
    }
      
  }
*/
  const visibleUsuarios = usuarios.filter((u) => {
    if (filtro === "activos") return u.activo;
    if (filtro === "inactivos") return !u.activo;
    if (filtro === "cancelados") return u.cancelado;
    return true;
  });

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="dashboard-page ">
      <header className="dashboard-hero gestion-hero">
        <div className="">
          <BrandHeader />
          <h1>Gestion de Usuarios</h1>
          <p>Panel de control para gestionar usuarios y sus cuotas.</p>

          <div className="top-actions">
            <button className="primary-btn" onClick={() => navigate("/home")}>
              Volver al Home
            </button>
            <button
              className="primary-btn"
              onClick={() => navigate("/registro")}
            >
              Registrar socio
            </button>
          </div>
        </div>
      </header>

      <section className="usuario-section">
        <div className="filtro-usuarios">
          <button
            className="filtrodeusuarios-btn"
            onClick={() => setFiltro("todos")}
          >
            Todos
          </button>
          <button
            className="filtrodeusuarios-btn"
            onClick={() => setFiltro("activos")}
          >
            Activos
          </button>
          <button onClick={() => setFiltro("inactivos")}>Inactivos</button>
          <button onClick={() => setFiltro("cancelados")}>Cancelados</button>
        </div>

        <div className="usuario-table-container">
          <table className="usuario-table">
            <thead>
              <tr>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.dni}</td>
                  <td>{usuario.nombre} </td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.plan}</td>
                  <td>
                    <span
                      className={
                        usuario.activo ? "status-active" : "status-inactive"
                      }
                    >
                      {usuario.activo ? "Activo" : "Inactivo"}
                      {usuario.cancelado && (
                        <span className="status-cancelado">Cancelado</span>
                      )}
                    </span>
                  </td>
                  <td className="usuario-actions">
                    <button
                      onClick={() =>
                        navigate(`/usuario/${usuario.id}/historial`)
                      }
                    >
                      Historial de pagos
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/usuario/${usuario.id}/registrar-pago`)
                      }
                    >
                      Registrar pago
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default GestionUsuario;
