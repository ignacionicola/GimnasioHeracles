import React, { useEffect, useState } from "react";
import "../components/styles/beneficios.css";
import { Container, Button, Modal, Form, Table, Badge } from "react-bootstrap";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import * as api from "../service/beneficiosService";
import { useBeneficiosStore } from "../stores/beneficiosStore";
import BrandHeader from "../components/BrandHeader";

function Beneficios() {
  const beneficios = useBeneficiosStore((s) => s.beneficios);
  const actualizarBeneficios = useBeneficiosStore((s) => s.setBeneficios);
  const guardarBeneficio = useBeneficiosStore((s) => s.addOrUpdateBeneficio);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [beneficioEditando, setBeneficioEditando] = useState(null);
  const [cargando, setCargando] = useState(true);

  // estados para los filtros 
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos"); // todos, activos o inactivos
  const [form, setForm] = useState({
    nombreBeneficio: "",
    descripcionBeneficio: "",
    precioPuntos: "",
  });
  const [guardando, setGuardando] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    cargarBeneficios();
  }, []);

  async function cargarBeneficios() {
    setCargando(true);
    try {
      const data = await api.getBeneficios();
      if (data) {
        const lista = Array.isArray(data) ? data : data.beneficios || data.data || data;
        actualizarBeneficios(lista || []);
      }
    } catch (err) {
      console.error("Error al cargar beneficios:", err);
    } finally {
      setCargando(false);
    }
  }

  const abrirModal = (beneficio = null) => {
    setErrors({});
    if (beneficio) {
      setBeneficioEditando(beneficio);
      setForm({
        nombreBeneficio: beneficio.nombreBeneficio ?? "",
        descripcionBeneficio: beneficio.descripcionBeneficio ?? "",
        precioPuntos: beneficio.precioPuntos ?? "",
      });
    } else {
      setBeneficioEditando(null);
      setForm({ nombreBeneficio: "", descripcionBeneficio: "", precioPuntos: "" });
    }
    setMostrarModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nombreBeneficio.trim()) newErrors.nombreBeneficio = "El nombre es obligatorio";
    if (!form.descripcionBeneficio.trim()) newErrors.descripcionBeneficio = "La descripción es obligatoria";
    if (!form.precioPuntos || Number(form.precioPuntos) < 0) newErrors.precioPuntos = "Ingrese una cantidad de puntos válida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log('[frontend] manejarEnvio fired, form:', form);
    if (guardando) return;
    setGuardando(true);

    const datos = { ...form, precioPuntos: Number(form.precioPuntos) };

    try {
      let nuevoBeneficioLocal;

      if (beneficioEditando) {
        nuevoBeneficioLocal = { ...(beneficioEditando || {}), ...datos };

        const id = beneficioEditando.idBeneficio ?? beneficioEditando.id;
        if (!id) {
          await cargarBeneficios();
          setGuardando(false);
          setMostrarModal(false);
          return;
        }

        const respuesta = await api.modificarBeneficio(id, datos);
        console.log("[frontend] modificarBeneficio respuesta:", respuesta);

        const beneficioActualizado = respuesta?.data ?? respuesta;

        if (beneficioActualizado) {
          guardarBeneficio(beneficioActualizado);
          setMostrarModal(false);
        } else {
          await cargarBeneficios();
          setMostrarModal(false);
        }

      } else {
        const respuesta = await api.crearBeneficio({ ...datos, activo: true });
        console.log("[frontend] crearBeneficio respuesta:", respuesta);

        const beneficioCreado = respuesta?.data ?? respuesta;

        if (beneficioCreado) {
          guardarBeneficio(beneficioCreado);
          setMostrarModal(false);
        } else {
          await cargarBeneficios();
          setMostrarModal(false);
        }
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      try {
        await cargarBeneficios();
        setMostrarModal(false);
      } catch (e) {
        console.error("Error al recargar tras fallo:", e);
      }
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (beneficio) => {
    try {
      const id = beneficio.idBeneficio || beneficio.id;
      const nuevoEstado = !beneficio.activo;

      guardarBeneficio({ ...beneficio, activo: nuevoEstado });

      await (beneficio.activo ?
        api.desactivarBeneficio(id) :
        api.activarBeneficio(id)
      );

    } catch (error) {
      console.error("Error al cambiar estado del beneficio:", error);
      guardarBeneficio({ ...beneficio, activo: beneficio.activo });
    }
  };

  const filtrarBeneficios = () => {
    return beneficios.filter(beneficio => {
      const coincideTexto =
        beneficio.nombreBeneficio.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
        beneficio.descripcionBeneficio.toLowerCase().includes(textoBusqueda.toLowerCase());

      if (!coincideTexto) return false;

      if (filtroEstado === "activos") return beneficio.activo;
      if (filtroEstado === "inactivos") return !beneficio.activo;
      return true;
    });
  };

  if (cargando) {
    return (
      <div className="loading">Cargando...</div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <BrandHeader subtitle="Gestión de Beneficios" variant="gift" />
        <h1>Beneficios del Gimnasio</h1>
        <p>
          Panel de control para gestionar los beneficios disponibles para los socios.
        </p>
      </header>

      <section className="dashboard-section">
        <div className="section-head d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h2>Listado de Beneficios</h2>
            <p>Administra, crea y edita los beneficios vigentes.</p>
          </div>
          <Button className="btn-crear" onClick={() => abrirModal()}>
            + Nuevo Beneficio
          </Button>
        </div>

        <div className="mb-4 row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <Form.Control
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="col-md-6 text-md-end">
            <Form.Check inline label="Todos" name="filtroEstado" type="radio" checked={filtroEstado === "todos"} onChange={() => setFiltroEstado("todos")} />
            <Form.Check inline label="Activos" name="filtroEstado" type="radio" checked={filtroEstado === "activos"} onChange={() => setFiltroEstado("activos")} />
            <Form.Check inline label="Inactivos" name="filtroEstado" type="radio" checked={filtroEstado === "inactivos"} onChange={() => setFiltroEstado("inactivos")} />
          </div>
        </div>

        <div className="beneficios-panel">
          {filtrarBeneficios().length === 0 ? (
            <div className="text-center my-4 text-muted">
              {beneficios.length === 0 ? "Todavía no hay beneficios cargados en el sistema" : "No se encontraron beneficios con los filtros seleccionados"}
            </div>
          ) : (
            <Table hover responsive className="beneficios-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Detalle</th>
                  <th>Puntos</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrarBeneficios().map((beneficio) => (
                  <tr key={beneficio.idBeneficio || beneficio.id}>
                    <td className="fw-bold">{beneficio.nombreBeneficio}</td>
                    <td className="text-muted small">{beneficio.descripcionBeneficio}</td>
                    <td>{beneficio.precioPuntos} pts</td>
                    <td>
                      <Badge bg={beneficio.activo ? "success" : "secondary"} className="beneficios-badge">
                        {beneficio.activo ? "Disponible" : "No Disponible"}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button variant="link" className="icon-btn" onClick={() => abrirModal(beneficio)} title="Editar beneficio">
                        <FiEdit2 size={18} />
                      </Button>
                      <Button variant="link" className={`icon-btn ${beneficio.activo ? "text-danger" : "text-success"}`} onClick={() => cambiarEstado(beneficio)} title={beneficio.activo ? "Desactivar beneficio" : "Activar beneficio"}>
                        <FiTrash2 size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </section>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered contentClassName="modal-dark">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>{beneficioEditando ? "Modificar Beneficio" : "Agregar Nuevo Beneficio"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={manejarEnvio}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="nombreBeneficio">Nombre del Beneficio</Form.Label>
              <Form.Control
                id="nombreBeneficio"
                name="nombreBeneficio"
                type="text"
                placeholder="Ej: Descuento en Proteínas"
                value={form.nombreBeneficio}
                onChange={(e) => {
                  setForm({ ...form, nombreBeneficio: e.target.value });
                  if (errors.nombreBeneficio) setErrors({ ...errors, nombreBeneficio: null });
                }}
                className={`form-dark ${errors.nombreBeneficio ? "is-invalid" : ""}`}
              />
              {errors.nombreBeneficio && <div className="invalid-feedback">{errors.nombreBeneficio}</div>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="descripcionBeneficio">Descripción Detallada</Form.Label>
              <Form.Control
                id="descripcionBeneficio"
                name="descripcionBeneficio"
                as="textarea"
                rows={3}
                placeholder="Detalles del beneficio..."
                value={form.descripcionBeneficio}
                onChange={(e) => {
                  setForm({ ...form, descripcionBeneficio: e.target.value });
                  if (errors.descripcionBeneficio) setErrors({ ...errors, descripcionBeneficio: null });
                }}
                className={`form-dark ${errors.descripcionBeneficio ? "is-invalid" : ""}`}
              />
              {errors.descripcionBeneficio && <div className="invalid-feedback">{errors.descripcionBeneficio}</div>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="precioPuntos">Cantidad de Puntos Necesarios</Form.Label>
              <Form.Control
                id="precioPuntos"
                name="precioPuntos"
                type="number"
                placeholder="0"
                min="0"
                value={form.precioPuntos}
                onChange={(e) => {
                  setForm({ ...form, precioPuntos: e.target.value });
                  if (errors.precioPuntos) setErrors({ ...errors, precioPuntos: null });
                }}
                className={`form-dark ${errors.precioPuntos ? "is-invalid" : ""}`}
              />
              {errors.precioPuntos && <div className="invalid-feedback">{errors.precioPuntos}</div>}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setMostrarModal(false)} disabled={guardando}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={guardando} className="btn-crear">
              {guardando ? (beneficioEditando ? "Guardando..." : "Creando...") : (beneficioEditando ? "Guardar Cambios" : "Crear Beneficio")}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Beneficios;
