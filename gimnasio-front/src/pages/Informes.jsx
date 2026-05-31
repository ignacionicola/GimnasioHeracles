import React, { useState } from "react";
import { Button, Card, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import BrandHeader from "../components/BrandHeader";
import "../styles/Informes.css";
import { getReporte } from "../service/reportesService";
import { FaUsers, FaCheckCircle, FaUserMinus } from "react-icons/fa";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import InformeCard from "../components/InformeCard";

function Informes() {
  const [fechaFoto1, setFechaFoto1] = useState("");
  const [reporteFoto1, setReporteFoto1] = useState(null);

  const [fechaFoto2, setFechaFoto2] = useState(new Date().toISOString().split("T")[0]);
  const [reporteFoto2, setReporteFoto2] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ show: false, titulo: "", usuarios: [] });

  const cargarFoto1 = async () => {
    if (!fechaFoto1) return;
    setLoading(true);
    setError("");
    try {
      const data = await getReporte(fechaFoto1);
      setReporteFoto1(data);
    } catch (err) {
      setError(err.message || "Error al cargar la foto 1");
    } finally {
      setLoading(false);
    }
  };

  const cargarFoto2 = async () => {
    if (!fechaFoto2) return;
    setLoading(true);
    setError("");
    try {
      const data = await getReporte(fechaFoto2);
      setReporteFoto2(data);
    } catch (err) {
      setError(err.message || "Error al cargar la foto 2");
    } finally {
      setLoading(false);
    }
  };

  const pieDataFoto1 = reporteFoto1
    ? [
        { name: "Activos", value: reporteFoto1.resumen.activos },
        { name: "Inactivos", value: reporteFoto1.resumen.inactivos },
      ]
    : [];

  const pieDataFoto2 = reporteFoto2
    ? [
        { name: "Activos", value: reporteFoto2.resumen.activos },
        { name: "Inactivos", value: reporteFoto2.resumen.inactivos },
      ]
    : [];

  const PIE_COLORS = ["#28a745", "#dc3545"];

  // deltas entre foto 1 y foto 2
  const deltaTotal =
    reporteFoto1 && reporteFoto2
      ? reporteFoto2.resumen.totalSocios - reporteFoto1.resumen.totalSocios
      : null;

  const deltaActivos =
    reporteFoto1 && reporteFoto2
      ? reporteFoto2.resumen.activos - reporteFoto1.resumen.activos
      : null;

  const deltaInactivos =
    reporteFoto1 && reporteFoto2
      ? reporteFoto2.resumen.inactivos - reporteFoto1.resumen.inactivos
      : null;


  const formatDelta = (delta, invertColors = false) => {
    const esBueno = invertColors ? delta < 0 : delta > 0;
    const color = delta === 0 ? "#f7f9fc" : esBueno ? "#28a745" : "#dc3545";
    const prefix = delta > 0 ? "+" : "";
    return <span style={{ color }}>{`${prefix}${delta}`}</span>;
  };

  const handleClickFoto1 = (_, index) => {
    setModal({
      show: true,
      titulo: index === 0 ? "Activos" : "Inactivos",
      usuarios:
        index === 0
          ? reporteFoto1.detalle.activos
          : reporteFoto1.detalle.inactivos,
    });
  };

  const handleClickFoto2 = (_, index) => {
    setModal({
      show: true,
      titulo: index === 0 ? "Activos" : "Inactivos",
      usuarios:
        index === 0
          ? reporteFoto2.detalle.activos
          : reporteFoto2.detalle.inactivos,
    });
  };

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="dashboard-hero gestion-hero">
        <BrandHeader />
        <h1>Informes y estadísticas</h1>
        <p>
          Panel de informes para analizar socios activos, retención y datos de
          cuotas.
        </p>
      </header>

      {/* ERROR GENERAL */}
      {error && (
        <div className="alert alert-danger" style={{ margin: "1rem auto" }}>
          {error}
        </div>
      )}

      {/* cards resumen */}
      <section className="mb-5" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Row className="g-4 justify-content-center">
          <Col xs={12} md={4} lg={4}>
            <InformeCard
              title="Cambio en socios"
              value={
                deltaTotal !== null
                  ? formatDelta(deltaTotal)
                  : (reporteFoto2?.resumen.totalSocios ?? "-")
              }
              description={
                reporteFoto1 && reporteFoto2
                  ? `De ${reporteFoto1.resumen.totalSocios} a ${reporteFoto2.resumen.totalSocios} socios`
                  : reporteFoto2
                  ? new Date(reporteFoto2.resumen.fecha).toLocaleDateString("es-AR")
                  : "Cargá las dos fotos para ver la evolución"
              }
              icon={<FaUsers size={24} />}
            />
          </Col>
          <Col xs={12} md={4} lg={4}>
            <InformeCard
              title="Cambio en activos"
              value={
                deltaActivos !== null
                  ? formatDelta(deltaActivos)
                  : (reporteFoto2?.resumen.activos ?? "-")
              }
              description={
                reporteFoto1 && reporteFoto2
                  ? `De ${reporteFoto1.resumen.activos} a ${reporteFoto2.resumen.activos} activos`
                  : reporteFoto2
                  ? new Date(reporteFoto2.resumen.fecha).toLocaleDateString("es-AR")
                  : "Cargá las dos fotos para ver la evolución"
              }
              icon={<FaCheckCircle size={24} />}
            />
          </Col>
          <Col xs={12} md={4} lg={4}>
            <InformeCard
              title="Cambio en inactivos"
              value={
                deltaInactivos !== null
                  ? formatDelta(deltaInactivos, true)
                  : (reporteFoto2?.resumen.inactivos ?? "-")
              }
              description={
                reporteFoto1 && reporteFoto2
                  ? `De ${reporteFoto1.resumen.inactivos} a ${reporteFoto2.resumen.inactivos} inactivos`
                  : reporteFoto2
                  ? new Date(reporteFoto2.resumen.fecha).toLocaleDateString("es-AR")
                  : "Cargá las dos fotos para ver la evolución"
              }
              icon={<FaUserMinus size={24} />}
            />
          </Col>
        </Row>
      </section>

      {/* GRÁFICOS */}
      <section className="mt-5" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title>Distribución de socios</Card.Title>

            {loading && (
              <div className="text-center my-3">
                <Spinner animation="border" size="sm" />
                <span style={{ marginLeft: "0.5rem" }}>Cargando...</span>
              </div>
            )}

            <Row className="g-4">
              {/* FOTO 1 */}
              <Col xs={12} md={6}>
                <Card className="h-100">
                  <Card.Body className="text-center p-4">
                    <h6 className="mb-3">Grafico 1 -  ¿Cómo estaba el gimnasio?</h6>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="date"
                        value={fechaFoto1}
                        onChange={(e) => setFechaFoto1(e.target.value)}
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mb-3"
                      onClick={cargarFoto1}
                    >
                      Aplicar
                    </Button>

                    {reporteFoto1 && reporteFoto1.resumen.totalSocios === 0 ? (
                      <div style={{ padding: "2rem", color: "#6c757d" }}>
                        No hay socios registrados en esta fecha
                      </div>
                    ) : reporteFoto1 ? (
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie
                            data={pieDataFoto1}
                            cx="50%"
                            cy="45%"
                            outerRadius={90}
                            dataKey="value"
                            onClick={handleClickFoto1}
                            style={{ cursor: "pointer" }}
                            label={renderLabel}
                            labelLine={false}
                          >
                            {pieDataFoto1.map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ padding: "2rem", color: "#6c757d" }}>
                        Seleccioná una fecha y hacé click en Aplicar
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* FOTO 2 */}
              <Col xs={12} md={6}>
                <Card className="h-100">
                  <Card.Body className="text-center p-4">
                    <h6 className="mb-3">Grafico 2 -  ¿Cómo está ahora?</h6>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="date"
                        value={fechaFoto2}
                        onChange={(e) => setFechaFoto2(e.target.value)}
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mb-3"
                      onClick={cargarFoto2}
                    >
                      Aplicar
                    </Button>

                    {reporteFoto2 ? (
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie
                            data={pieDataFoto2}
                            cx="50%"
                            cy="45%"
                            outerRadius={90}
                            dataKey="value"
                            onClick={handleClickFoto2}
                            style={{ cursor: "pointer" }}
                            label={renderLabel}
                            labelLine={false}
                          >
                            {pieDataFoto2.map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div style={{ padding: "2rem", color: "#6c757d" }}>
                        Seleccioná una fecha y hacé click en Aplicar
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </section>

      {/* MODAL CON LISTADO DE SOCIOS */}
      <Modal
        show={modal.show}
        onHide={() => setModal({ ...modal, show: false })}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{modal.titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal.usuarios.length === 0 ? (
            <p>No hay socios en esta categoría.</p>
          ) : (
            <table className="styled-table mb-0 w-100">
              <thead>
                <tr>
                  <th>DNI</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                </tr>
              </thead>
              <tbody>
                {modal.usuarios.map((u) => (
                  <tr key={u.dni}>
                    <td>{u.dni}</td>
                    <td>{u.nombre}</td>
                    <td>{u.apellido}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Informes;
