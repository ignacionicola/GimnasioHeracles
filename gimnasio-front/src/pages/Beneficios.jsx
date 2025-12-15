import { useEffect, useState } from "react";
import { Button, Modal, Form, Table, Badge } from "react-bootstrap";
import * as api from "../service/beneficiosService";
import { useBeneficiosStore } from "../stores/beneficiosStore";
import BrandHeader from "../components/BrandHeader";

function Beneficios() {
  const beneficios = useBeneficiosStore((s) => s.beneficios);
  const setBeneficios = useBeneficiosStore((s) => s.setBeneficios);
  const addOrUpdateBeneficio = useBeneficiosStore((s) => s.addOrUpdateBeneficio);

  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editBeneficio, setEditBeneficio] = useState(null);
  const [form, setForm] = useState({ nombreBeneficio: "", descripcionBeneficio: "", precioPuntos: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const load = async () => {
      setCargando(true);
      try {
        const data = await api.getBeneficios();
        setBeneficios(Array.isArray(data) ? data : data?.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    load();
  }, [setBeneficios]);

  const openModal = (item = null) => {
    if (item) {
      setEditBeneficio(item);
      setForm({
        nombreBeneficio: item.nombreBeneficio || "",
        descripcionBeneficio: item.descripcionBeneficio || "",
        precioPuntos: item.precioPuntos ?? "",
      });
    } else {
      setEditBeneficio(null);
      setForm({ nombreBeneficio: "", descripcionBeneficio: "", precioPuntos: "" });
    }
    setError("");
    setModalVisible(true);
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!form.nombreBeneficio.trim() || !form.descripcionBeneficio.trim() || Number(form.precioPuntos) <= 0) {
      setError("Completa todos los campos correctamente");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, precioPuntos: Number(form.precioPuntos), activo: true };
      const result = editBeneficio
        ? await api.modificarBeneficio(editBeneficio.idBeneficio || editBeneficio.id, payload)
        : await api.crearBeneficio(payload);

      const beneficiodata = result?.data || result;
      if (beneficiodata) addOrUpdateBeneficio(beneficiodata);
      setModalVisible(false);
    } catch (err) {
      setError(err.message || "Error en guardado");
    } finally {
      setSaving(false);
    }
  };

  const toggleActivo = async (item) => {
    const id = item.idBeneficio || item.id;
    const nextActivo = !item.activo;
    addOrUpdateBeneficio({ ...item, activo: nextActivo });
    try {
      if (item.activo) {
        await api.desactivarBeneficio(id);
      } else {
        await api.activarBeneficio(id);
      }
    } catch (err) {
      addOrUpdateBeneficio(item);
      console.error(err);
    }
  };

  if (cargando) return <div className="loading">Cargando...</div>;

  const filtered = beneficios.filter((b) => 
    b.nombreBeneficio?.toLowerCase().includes(searchText.toLowerCase()) || 
    b.descripcionBeneficio?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <BrandHeader subtitle="Gestión de Beneficios" variant="gift" />
      <div className="d-flex justify-content-between">
        <h2>Beneficios</h2>
        <Button onClick={() => openModal()}>+ Nuevo</Button>
      </div>

      <Form.Control
        type="text"
        placeholder="Buscar..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="my-3"
      />

      <Table hover responsive>
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
          {filtered.length === 0 ? (
            <tr><td colSpan="5" className="text-center">No hay beneficios</td></tr>
          ) : filtered.map((item) => (
            <tr key={item.idBeneficio || item.id}>
              <td>{item.nombreBeneficio}</td>
              <td>{item.descripcionBeneficio}</td>
              <td>{item.precioPuntos}</td>
              <td>
                <Badge bg={item.activo ? "success" : "secondary"}>
                  {item.activo ? "Activo" : "Inactivo"}
                </Badge>
              </td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => openModal(item)}>Editar</Button>{' '}
                <Button size="sm" variant={item.activo ? "outline-danger" : "outline-success"} onClick={() => toggleActivo(item)}>
                  {item.activo ? "Desactivar" : "Activar"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={modalVisible} onHide={() => setModalVisible(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editBeneficio ? "Editar" : "Agregar"} Beneficio</Modal.Title>
        </Modal.Header>
        <Form onSubmit={onSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={form.nombreBeneficio} onChange={(e) => setForm({ ...form, nombreBeneficio: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.descripcionBeneficio} onChange={(e) => setForm({ ...form, descripcionBeneficio: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Puntos</Form.Label>
              <Form.Control type="number" min="0" value={form.precioPuntos} onChange={(e) => setForm({ ...form, precioPuntos: e.target.value })} />
            </Form.Group>
            {error && <div className="text-danger mb-2">{error}</div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalVisible(false)} disabled={saving}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? "Guardando..." : editBeneficio ? "Guardar" : "Crear"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Beneficios;