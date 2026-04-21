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
 
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);

  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    plan: "",
  });
 const [feedback, setFeedback] = useState({ type: "", message: "" });
   const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});



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

      const data = await response.json();
      

      if (!response.ok) {
        /* pongo el msg que viene del backend */
        throw new Error(data.error || data.message);
      }

      const nuevoSocio = data.usuario || data.nuevoUsuario || {...formData, activo: true};
      setUsuarios((prev) => [...prev, nuevoSocio]);
      

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
      /* aca debe aparecer el msg*/
      setFeedback({ type: "error", message: error.message });
    } finally {
      setLoading(false);
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
          <button className="primary-btn2" onClick={() => navigate("/home")}>
            Volver al Home
          </button>
          <button className="primary-btn2" onClick={() => setMostrarModalRegistro(true)}>
            Registrar socio
          </button>
          <button className="primary-btn2" onClick={() => handleMostrarPagos()}>
            Mostrar Pagos
          </button>
        </div>
      </header>


<Modal
  show={mostrarModalRegistro}
  onHide={() => setMostrarModalRegistro(false)}
  centered
  size="lg"
>
  <Modal.Header closeButton>
    <Modal.Title>Registrar nuevo socio</Modal.Title>
  </Modal.Header>
  <Modal.Body>
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

      <Modal.Footer>
           <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Registrando..." : "Registrar Socio"}
          </button>
    </Modal.Footer>
    </form>
  </Modal.Body>
</Modal>


      <Modal className="modal-pagos"
        show={mostrarModalPagos}
        onHide={() => setMostrarModalPagos(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title >Pagos registrados</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-pagos">
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
                        style={usuario.activo ? { color: "green" } : { color: "red" }}
                    >
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </span>

                  </td>
                  <td>
                    <button
                      className="registrarpago"
                      onClick={() => abrirModalHistorial(usuario)}
                    >
                      Ver Historial
                    </button>
                    <button
                      className="registrarpago"
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
