import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Modal } from "react-bootstrap";
import BrandHeader from "../components/BrandHeader";
import "../components/styles/beneficios.css";
import "../styles/GestionUsuario.css";
import { getUsuarios } from "../service/usuarioService";
import {
  crearCuota,
  getCuotas,
  getCuotasPorSocio,
} from "../service/cuotaService";

function GestionUsuario() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarModalPagos, setMostrarModalPagos] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [cargandoPagos, setCargandoPagos] = useState(false);
  const [errorPagos, setErrorPagos] = useState("");

  const [mostrarModalHistorial, setMostrarModalHistorial] = useState(false);
  const [cuotasHistorial, setCuotasHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [errorHistorial, setErrorHistorial] = useState("");

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

  //funcion mostrar pagos
  const handleMostrarPagos = async () => {
    setMostrarModalPagos(true);
    setErrorPagos("");
    setCargandoPagos(true);

    try {
      const cuotas = await getCuotas();
      const pagosConSocio = (
        Array.isArray(cuotas) ? cuotas : cuotas?.data || []
      ).map((pago) => {
        const socio =
          pago.Usuario ||
          pago.usuario ||
          usuarios.find((u) => String(u.dni) === String(pago.idSocio));

        return {
          ...pago,
          socio,
        };
      });
      setPagos(pagosConSocio);
    } catch (err) {
      setErrorPagos(err.message || "Error al cargar pagos");
    } finally {
      setCargandoPagos(false);
    }
  };

  const visibleUsuarios = usuarios.filter((u) => {
    const texto = textoBusqueda.toLowerCase().trim();
    const coincideBusqueda =
      !texto ||
      u.nombre?.toLowerCase().includes(texto) ||
      u.apellido?.toLowerCase().includes(texto) ||
      u.email?.toLowerCase().includes(texto);

    if (!coincideBusqueda) return false;
    if (filtroEstado === "activos") return u.activo;
    if (filtroEstado === "inactivos") return !u.activo;
    return true;
  });

  const handleRegistrarPago = async (usuario) => {
    if (!usuario) return;

    try {
      await crearCuota({
        idSocio: usuario.dni,
        monto: 1000, // mockuado
      });

      setUsuarios((prev) =>
        prev.map((u) => (u.dni === usuario.dni ? { ...u, activo: true } : u)),
      );
    } catch (err) {
      console.error("Error al registrar pago:", err);
    }
  };

  const abrirModalHistorial = async (usuario) => {
    if (!usuario) return;

    setUsuarioSeleccionado(usuario);
    setErrorHistorial("");
    setCuotasHistorial([]);
    setMostrarModalHistorial(true);
    setCargandoHistorial(true);

    try {
      const cuotas = await getCuotasPorSocio(usuario.dni);
      setCuotasHistorial(Array.isArray(cuotas) ? cuotas : cuotas?.data || []);
    } catch (err) {
      setErrorHistorial(err.message || "Error al cargar historial");
    } finally {
      setCargandoHistorial(false);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero gestion-hero">
        <BrandHeader />
        <h1>Gestion de Usuarios</h1>
        <p>Panel de control para gestionar usuarios y sus cuotas.</p>

        <div className="top-actions">
          <button className="primary-btn" onClick={() => navigate("/home")}>
            Volver al Home
          </button>
          <button className="primary-btn" onClick={() => navigate("/registro")}>
            Registrar socio
          </button>
          <button className="primary-btn" onClick={() => handleMostrarPagos()}>
            Mostrar Pagos
          </button>
        </div>
      </header>

      <Modal
        show={mostrarModalPagos}
        onHide={() => setMostrarModalPagos(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Pagos registrados</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorPagos && <div className="alert alert-danger">{errorPagos}</div>}

          {cargandoPagos ? (
            <div>Cargando pagos...</div>
          ) : pagos.length === 0 ? (
            <div>No hay pagos registrados</div>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Número Cuota</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>DNI</th>
                  <th>Monto</th>
                  <th>Fecha Pago</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago.idCuota ?? pago.id}>
                    <td>{pago.idCuota ?? pago.id}</td>
                    <td>
                      {pago.socio?.nombre || pago.Usuario?.nombre || "NA"}
                    </td>
                    <td>
                      {pago.socio?.apellido || pago.Usuario?.apellido || "NA"}
                    </td>
                    <td>
                      {pago.socio?.dni || pago.Usuario?.dni || pago.idSocio}
                    </td>
                    <td>${Number(pago.monto).toFixed(2)}</td>
                    <td>
                      {new Date(pago.fechaPago).toLocaleDateString("es-AR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal.Body>
      </Modal>

      <section className="usuario-section">
        <div className="mb-4 row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <Form.Control
              type="text"
              placeholder="Buscar por usuario, apellido o email..."
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="col-md-6 text-md-end">
            <Form.Check
              inline
              label="Todos"
              name="filtroEstado"
              type="radio"
              checked={filtroEstado === "todos"}
              onChange={() => setFiltroEstado("todos")}
            />
            <Form.Check
              inline
              label="Activos"
              name="filtroEstado"
              type="radio"
              checked={filtroEstado === "activos"}
              onChange={() => setFiltroEstado("activos")}
            />
            <Form.Check
              inline
              label="Inactivos"
              name="filtroEstado"
              type="radio"
              checked={filtroEstado === "inactivos"}
              onChange={() => setFiltroEstado("inactivos")}
            />
          </div>
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
                <tr key={usuario.dni}>
                  <td>{usuario.dni}</td>
                  <td>{usuario.nombre}</td>
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
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-action"
                      onClick={() => abrirModalHistorial(usuario)}
                    >
                      Ver Historial
                    </button>
                    <button
                      className="btn-actions"
                      onClick={() => handleRegistrarPago(usuario)}
                    >
                      Registrar Pago
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        show={mostrarModalHistorial}
        onHide={() => setMostrarModalHistorial(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Historial de pagos - {usuarioSeleccionado?.nombre}{" "}
            {usuarioSeleccionado?.apellido}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {errorHistorial && (
            <div className="alert alert-danger">{errorHistorial}</div>
          )}

          {cargandoHistorial ? (
            <div>Cargando historial...</div>
          ) : cuotasHistorial.length === 0 ? (
            <div>No hay pagos registrados para este socio</div>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  {/* <th>ID</th> */}
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha Pago</th>
                  <th>Vencimiento</th>
                </tr>
              </thead>
              <tbody>
                {cuotasHistorial.map((cuota) => (
                  <tr key={cuota.idCuota}>
                    {/* <td>{cuota.idCuota}</td> */}
                    <td>${cuota.monto}</td>
                    <td>{cuota.estado}</td>
                    <td>
                      {new Date(cuota.fechaPago).toLocaleDateString("es-AR")}
                    </td>
                    <td>
                      {new Date(cuota.fechaVencimiento).toLocaleDateString(
                        "es-AR",
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button
            className="secondary-btn"
            onClick={() => setMostrarModalHistorial(false)}
          >
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GestionUsuario;
