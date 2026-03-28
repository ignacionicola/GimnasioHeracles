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
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [form, setForm] = useState({
    nombreBeneficio: "",
    descripcionBeneficio: "",
    precioPuntos: "",
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarBeneficios();
  }, []);

  async function cargarBeneficios() {
    setCargando(true);
    try {
      const data = await api.getBeneficios();
      const lista = Array.isArray(data) ? data : data.beneficios || data.data || data;
      actualizarBeneficios(lista || []);
    } catch (err) {
      console.error("Error al cargar beneficios:", err);
    } finally {
      setCargando(false);
    }
  }

  const abrirModal = (beneficio = null) => {
    setError("");
    if (beneficio) {
      setBeneficioEditando(beneficio);
      setForm({
        nombreBeneficio: beneficio.nombreBeneficio || "",
        descripcionBeneficio: beneficio.descripcionBeneficio || "",
        precioPuntos: beneficio.precioPuntos || "",
      });
    } else {
      setBeneficioEditando(null);
      setForm({ nombreBeneficio: "", descripcionBeneficio: "", precioPuntos: "" });
    }
    setMostrarModal(true);
  };

  const validarForm = () => {
    if (!form.nombreBeneficio.trim()) {
      setError("El nombre es obligatorio");
      return false;
    }
    if (!form.descripcionBeneficio.trim()) {
      setError("La descripción es obligatoria");
      return false;
    }
    if (!form.precioPuntos || Number(form.precioPuntos) < 0) {
      setError("Ingrese una cantidad de puntos válida");
      return false;
    }
    setError("");
    return true;
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!validarForm() || guardando) return;

    setGuardando(true);
    const datos = { ...form, precioPuntos: Number(form.precioPuntos) };

    try {
      if (beneficioEditando) {
        const id = beneficioEditando.idBeneficio || beneficioEditando.id;
        const respuesta = await api.modificarBeneficio(id, datos);
        const beneficioActualizado = respuesta?.data || respuesta;
        if (beneficioActualizado) {
          guardarBeneficio(beneficioActualizado);
        }
      } else {
        const respuesta = await api.crearBeneficio({ ...datos, activo: true });
        const beneficioCreado = respuesta?.data || respuesta;
        if (beneficioCreado) {
          guardarBeneficio(beneficioCreado);
        }
      }
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      await cargarBeneficios();
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (beneficio) => {
    try {
      const id = beneficio.idBeneficio || beneficio.id;
      const nuevoEstado = !beneficio.activo;
      
      guardarBeneficio({ ...beneficio, activo: nuevoEstado });
      
      if (beneficio.activo) {
        await api.desactivarBeneficio(id);
      } else {
        await api.activarBeneficio(id);
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
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
    return <div className="loading">Cargando...</div>;
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
            {error && <div className="alert alert-danger">{error}</div>}
            <Form.Group className="mb-3">
              <Form.Label htmlFor="nombreBeneficio">Nombre del Beneficio</Form.Label>
              <Form.Control
                id="nombreBeneficio"
                name="nombreBeneficio"
                type="text"
                placeholder="Ej: Descuento en Proteínas"
                value={form.nombreBeneficio}
                onChange={(e) => setForm({ ...form, nombreBeneficio: e.target.value })}
                className="form-dark"
              />
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
                onChange={(e) => setForm({ ...form, descripcionBeneficio: e.target.value })}
                className="form-dark"
              />
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
                onChange={(e) => setForm({ ...form, precioPuntos: e.target.value })}
                className="form-dark"
              />
            </Form.Group>
          </Modal.Body>
         <Modal.Footer className="d-flex justify-content-between gap-2">
          <Button variant="danger" size="sm" onClick={() => setMostrarModal(false)} disabled={guardando}>Cancelar</Button>
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