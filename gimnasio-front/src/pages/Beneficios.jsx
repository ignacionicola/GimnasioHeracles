import React, { useEffect, useState } from "react";
import "../components/styles/beneficios.css";
import { Container, Button, Modal, Form, Table, Badge } from "react-bootstrap";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import * as api from "../service/beneficiosService";
import { useBeneficiosStore } from "../stores/beneficiosStore";

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

  const manejarEnvio = async (e) => {
    e.preventDefault();
    console.log('[frontend] manejarEnvio fired, form:', form);
    if (guardando) return; 
    setGuardando(true);

    // actualiza la UI inmediatamente para que el usuario vea el cambio
    const datos = { ...form, precioPuntos: Number(form.precioPuntos) };

    try {
      let nuevoBeneficioLocal;

      if (beneficioEditando) {
        // crear objeto local con los cambios
        nuevoBeneficioLocal = { ...(beneficioEditando || {}), ...datos };
        guardarBeneficio(nuevoBeneficioLocal); // actualiza store inmediatamente
        setMostrarModal(false);

        // intentar persistir en backend ( id )
        const id = beneficioEditando.idBeneficio ?? beneficioEditando.id;
        if (!id) {
          // si por algún motivo no tenemos id, recargar la lista para evitar duplicados
          await cargarBeneficios();
          setGuardando(false);
          return;
        }

  const respuesta = await api.modificarBeneficio(id, datos);
  console.log("[frontend] modificarBeneficio respuesta:", respuesta);
  const payload = respuesta?.data ?? respuesta;
  const nuevoDesdeBackend = payload?.beneficio ?? payload?.data ?? payload ?? null;

        // si backend devuelve objeto con id/estado actualizado, usarlo para sincronizar
        if (nuevoDesdeBackend) guardarBeneficio(nuevoDesdeBackend);
        else await cargarBeneficios(); // si no devuelve, recargar para confirmar
      } else {
  // creación optimista: crear objeto temporal (marcada con _temp para luego reemplazarla)
  nuevoBeneficioLocal = { idBeneficio: Date.now(), ...datos, activo: true, _temp: true };
        guardarBeneficio(nuevoBeneficioLocal);
        setMostrarModal(false);

        // persistir en backend
  const respuesta = await api.crearBeneficio({ ...datos, activo: true });
  console.log("[frontend] crearBeneficio respuesta:", respuesta);
  const payload = respuesta?.data ?? respuesta;
  const nuevoDesdeBackend = payload?.beneficio ?? payload?.data ?? payload ?? null;

        if (nuevoDesdeBackend) {
          // reemplaza el temporal por el real
          guardarBeneficio(nuevoDesdeBackend);
        } else {
          // si backend no devolvió el objeto, recarga la lista completa
          await cargarBeneficios();
        }
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("No se pudo guardar el beneficio en el servidor.");
      // intentar recargar desde el servidor 
      try {
        await cargarBeneficios();
      } catch (e) {
        console.error("Error al recargar tras fallo:", e);
      }
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (beneficio) => {
    try {
      await (beneficio.activo ? 
        api.desactivarBeneficio(beneficio.idBeneficio || beneficio.id) : 
        api.activarBeneficio(beneficio.idBeneficio || beneficio.id)
      );
      guardarBeneficio({ ...beneficio, activo: !beneficio.activo });
    } catch (error) {
      console.error("Error al cambiar estado del beneficio:", error);
    }
  };

  // funcion simple para filtrar beneficios
  const filtrarBeneficios = () => {
    return beneficios.filter(beneficio => {
      // primero filtramos por el texto de busqueda
      const coincideTexto = 
        beneficio.nombreBeneficio.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
        beneficio.descripcionBeneficio.toLowerCase().includes(textoBusqueda.toLowerCase());
      
      if (!coincideTexto) return false;

      // luego por estado
      if (filtroEstado === "activos") return beneficio.activo;
      if (filtroEstado === "inactivos") return !beneficio.activo;
      return true; // si es "todos" mostramos todo
    });
  };

  if (cargando) {
    return (
      <Container fluid>
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando beneficios...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="beneficios-container">
      <div className="header-hero">
        <div className="beneficios-titulo-container">
          <h2 className="beneficios-titulo">Beneficios del Gimnasio</h2>
          <p className="beneficios-subtitulo">Panel de control para gestionar los beneficios disponibles</p>
        </div>
        {/* El botón de crear fue movido al pie del panel para mejor UX */}
      </div>

      <div className="mb-4 row align-items-center">
        <div className="col-md-6 mb-3 mb-md-0">
          <Form.Control type="text" placeholder="Buscar por nombre o descripción..." value={textoBusqueda} onChange={(e) => setTextoBusqueda(e.target.value)} />
        </div>
        <div className="col-md-6">
          <Form.Check inline label="Todos" name="filtroEstado" type="radio" checked={filtroEstado === "todos"} onChange={() => setFiltroEstado("todos")} />
          <Form.Check inline label="Activos" name="filtroEstado" type="radio" checked={filtroEstado === "activos"} onChange={() => setFiltroEstado("activos")} />
          <Form.Check inline label="Inactivos" name="filtroEstado" type="radio" checked={filtroEstado === "inactivos"} onChange={() => setFiltroEstado("inactivos")} />
        </div>
      </div>

  <div className="beneficios-panel">
        {filtrarBeneficios().length === 0 ? (
          <div className="text-center my-4">{beneficios.length === 0 ? "Todavía no hay beneficios cargados en el sistema" : "No se encontraron beneficios con los filtros seleccionados"}</div>
        ) : (
          <Table hover responsive className="beneficios-table">
            <thead>
              <tr>
                <th>Nombre del Beneficio</th>
                <th>Detalle</th>
                <th>Puntos Necesarios</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtrarBeneficios().map((beneficio) => (
                <tr key={beneficio.idBeneficio || beneficio.id}>
                  <td>{beneficio.nombreBeneficio}</td>
                  <td>{beneficio.descripcionBeneficio}</td>
                  <td>{beneficio.precioPuntos}</td>
                  <td>
                    <Badge bg={beneficio.activo ? "success" : "secondary"} style={{ borderRadius: "12px", padding: "0.5em 1em", fontSize: "0.85em" }}>{beneficio.activo ? "Disponible" : "No Disponible"}</Badge>
                  </td>
                  <td className="text-end">
                    <Button variant="link" className="p-0 me-3" onClick={() => abrirModal(beneficio)} title="Editar beneficio"><FiEdit2 size={18} /></Button>
                    <Button variant="link" className={`p-0 ${beneficio.activo ? "text-danger" : "text-success"}`} onClick={() => cambiarEstado(beneficio)} title={beneficio.activo ? "Desactivar beneficio" : "Activar beneficio"}><FiTrash2 size={18} /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

  <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{beneficioEditando ? "Modificar Beneficio" : "Agregar Nuevo Beneficio"}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={manejarEnvio}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="nombreBeneficio">Nombre del Beneficio</Form.Label>
                <Form.Control id="nombreBeneficio" name="nombreBeneficio" type="text" placeholder="" value={form.nombreBeneficio} onChange={(e) => setForm({ ...form, nombreBeneficio: e.target.value })} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="descripcionBeneficio">Descripción Detallada</Form.Label>
                <Form.Control id="descripcionBeneficio" name="descripcionBeneficio" as="textarea" rows={3} placeholder="" value={form.descripcionBeneficio} onChange={(e) => setForm({ ...form, descripcionBeneficio: e.target.value })} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="precioPuntos">Cantidad de Puntos Necesarios</Form.Label>
                <Form.Control id="precioPuntos" name="precioPuntos" type="number" placeholder="0" min="0" value={form.precioPuntos} onChange={(e) => setForm({ ...form, precioPuntos: e.target.value })} required />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={() => setMostrarModal(false)} disabled={guardando}>Cancelar</Button>
              <Button variant="primary" type="submit" disabled={guardando}>{guardando ? (beneficioEditando ? "Guardando..." : "Creando...") : (beneficioEditando ? "Guardar Cambios" : "Crear Beneficio")}</Button>
            </Modal.Footer>
          </Form>
        </Modal>
        {/* Footer simple debajo del panel con el botón de crear */}
        <div className="text-center mt-3">
          <Button className="btn-crear" onClick={() => abrirModal()}>Nuevo Beneficio</Button>
        </div>
      </div>
    </Container>
  );
}

export default Beneficios;

