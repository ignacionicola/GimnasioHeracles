import React, { useEffect, useMemo, useState } from "react";
import "../components/styles/beneficios.css";
import { Button, Modal, Form, Table, Badge } from "react-bootstrap";
import { FiEdit2 } from "react-icons/fi";
import * as api from "../service/planesService";
import BrandHeader from "../components/BrandHeader";

function Planes() {
  const [planes, setPlanes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [planEditando, setPlanEditando] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [form, setForm] = useState({
    nombrePlan: "",
    descripcion: "",
    precio: "",
  });

  useEffect(() => {
    cargarPlanes();
  }, []);

  async function cargarPlanes() {
    setCargando(true);
    setError("");

    try {
      const data = await api.obtenerPlanes();
      const lista = Array.isArray(data) ? data : data?.planes || data?.data || [];
      setPlanes(lista || []);
    } catch (err) {
      console.error("Error al cargar planes:", err);
      setError(err.message || "No se pudieron cargar los planes");
    } finally {
      setCargando(false);
    }
  }

  const abrirModal = (plan = null) => {
    setError("");

    if (plan) {
      setPlanEditando(plan);
      setForm({
        nombrePlan: plan.nombrePlan || "",
        descripcion: plan.descripcion || "",
        precio: plan.precio ?? "",
      });
    } else {
      setPlanEditando(null);
      setForm({
        nombrePlan: "",
        descripcion: "",
        precio: "",
      });
    }

    setMostrarModal(true);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setMostrarModal(false);
    setPlanEditando(null);
    setError("");
    setForm({
      nombrePlan: "",
      descripcion: "",
      precio: "",
    });
  };

  const validarForm = () => {
    if (!form.nombrePlan.trim()) {
      setError("El nombre del plan es obligatorio");
      return false;
    }

    if (!form.descripcion.trim()) {
      setError("La descripción del plan es obligatoria");
      return false;
    }

    if (form.precio === "" || Number.isNaN(Number(form.precio)) || Number(form.precio) <= 0) {
      setError("Ingresá un precio válido mayor a 0");
      return false;
    }

    setError("");
    return true;
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!validarForm() || guardando) return;

    setGuardando(true);
    setError("");

    const payload = {
      nombrePlan: form.nombrePlan.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
    };

    try {
      if (planEditando) {
        const id = planEditando.idPlan || planEditando.id;
        const actualizado = await api.actualizarPlan(id, payload);

        const planActualizado = actualizado?.data || actualizado;
        if (planActualizado) {
          setPlanes((prev) =>
            prev.map((p) => {
              const pid = p.idPlan || p.id;
              const uid = planActualizado.idPlan || planActualizado.id;
              return String(pid) === String(uid) ? planActualizado : p;
            })
          );
        } else {
          await cargarPlanes();
        }
      } else {
        const creado = await api.crearPlan(payload);
        const nuevoPlan = creado?.data || creado;

        if (nuevoPlan) {
          setPlanes((prev) => [...prev, nuevoPlan]);
        } else {
          await cargarPlanes();
        }
      }

      cerrarModal();
    } catch (err) {
      console.error("Error al guardar plan:", err);
      setError(err.message || "No se pudo guardar el plan");
    } finally {
      setGuardando(false);
    }
  };

  const planesFiltrados = useMemo(() => {
    const txt = textoBusqueda.trim().toLowerCase();
    if (!txt) return planes;

    return planes.filter((plan) => {
      const nombre = (plan.nombrePlan || "").toLowerCase();
      const descripcion = (plan.descripcion || "").toLowerCase();
      return nombre.includes(txt) || descripcion.includes(txt);
    });
  }, [planes, textoBusqueda]);

  if (cargando) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <BrandHeader subtitle="Gestión de Planes" />
        <h1>Planes del Gimnasio</h1>
        <p>Panel de control para crear y editar los planes disponibles.</p>
        
        {// ir a gestion de usuarios
        } <Button variant="primary" className="primary-btn6" onClick={() => window.history.back()}>
          Volver a Gestión de Usuarios
        </Button>
        

      </header>

      <section className="dashboard-section">
        <div className="section-head d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h2>Listado de Planes</h2>
            <p>Administrá nombre, descripción y precio de cada plan.</p>
          </div>
          <Button className="btn-crear" onClick={() => abrirModal()}>
             Crear Plan
          </Button>
        </div>

        <div className="mb-4 row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <Form.Control
              type="text"
               
                
                placeholder ="Buscar por nombre o descripción..."
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
              className="search-input "
            />
          </div>
        </div>

        <div className="beneficios-panel">
          {planesFiltrados.length === 0 ? (
            <div className="text-center my-4 text-muted">
              {planes.length === 0
                ? "Todavía no hay planes cargados en el sistema"
                : "No se encontraron planes con el filtro ingresado"}
            </div>
          ) : (
            <Table hover responsive className="beneficios-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {planesFiltrados.map((plan) => (
                  <tr key={plan.idPlan || plan.id}>
                    <td className="fw-bold">{plan.nombrePlan}</td>
                    <td className="text-muted small">{plan.descripcion}</td>
                    <td>${Number(plan.precio || 0).toFixed(2)}</td>
                    <td>
                      <Badge bg="success" className="beneficios-badge">
                        Vigente
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button
                        variant="link"
                        className="icon-btn"
                        onClick={() => abrirModal(plan)}
                        title="Editar plan"
                      >
                        <FiEdit2 size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </section>

      <Modal
        show={mostrarModal}
        onHide={cerrarModal}
        centered
        contentClassName="modal-dark"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>{planEditando ? "Modificar Plan" : "Agregar Nuevo Plan"}</Modal.Title>
        </Modal.Header>

        <Form onSubmit={manejarEnvio}>
          <Modal.Body>
            {error && <div className="alert alert-danger">{error}</div>}

            <Form.Group className="mb-3">
              <Form.Label htmlFor="nombrePlan">Nombre del Plan</Form.Label>
              <Form.Control
                id="nombrePlan"
                name="nombrePlan"
                type="text"
                placeholder="Ej: Básico"
                value={form.nombrePlan}
                onChange={(e) => setForm({ ...form, nombrePlan: e.target.value })}
                className="form-dark"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="descripcion">Descripción</Form.Label>
              <Form.Control
                id="descripcion"
                name="descripcion"
                as="textarea"
                rows={3}
                placeholder="Detalles del plan..."
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="form-dark"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="precio">Precio</Form.Label>
              <Form.Control
                id="precio"
                name="precio"
                type="number"
                placeholder="0"
                min="1"
                step="0.01"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                className="form-dark"
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="d-flex justify-content-between gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={cerrarModal}
              disabled={guardando}
            >
              Cancelar
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={guardando}
              className="btn-crear"
            >
              {guardando
                ? planEditando
                  ? "Guardando..."
                  : "Creando..."
                : planEditando
                ? "Guardar Cambios"
                : "Crear Plan"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Planes;