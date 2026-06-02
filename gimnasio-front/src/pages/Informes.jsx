import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import BrandHeader from "../components/BrandHeader";
import "../styles/Informes.css";
import { getReporte } from "../service/reportesService";
import { FaUsers, FaCheckCircle, FaUserMinus, FaFilePdf } from "react-icons/fa";
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from "recharts";
import InformeCard from "../components/InformeCard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Informes() {
  const navigate = useNavigate();
  const [fechaFoto1, setFechaFoto1] = useState("");
  const [reporteFoto1, setReporteFoto1] = useState(null);

  const [fechaFoto2, setFechaFoto2] = useState(new Date().toISOString().split("T")[0]);
  const [reporteFoto2, setReporteFoto2] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generandoPDF, setGenerandoPDF] = useState(false);

  const pdfRef = useRef(null);

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

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent === 0) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const descargarPDF = async () => {
    if (!pdfRef.current) return;
    setGenerandoPDF(true);
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0f172a",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pdfW / canvas.width, pdfH / canvas.height);
      const imgX = (pdfW - canvas.width * ratio) / 2;
      pdf.addImage(imgData, "PNG", imgX, 10, canvas.width * ratio, canvas.height * ratio);
      const fecha = new Date().toISOString().split("T")[0];
      pdf.save(`informe-gimnasio-${fecha}.pdf`);
    } finally {
      setGenerandoPDF(false);
    }
  };

  const PieLegend = ({ activos, inactivos, total }) => {
    return (
      <div className="pie-legend">
        <div className="pie-legend-total">
          <span className="pie-legend-total-label">Total Socios</span>
          <span className="pie-legend-total-num">{total}</span>
        </div>
        <div className="pie-legend-divider" />
        <div className="pie-legend-item">
          <span className="pie-legend-dot" style={{ backgroundColor: "#28a745" }} />
          <span className="pie-legend-label">Activos</span>
          <span className="count-activos pie-legend-num">{activos}</span>
        </div>
        <div className="pie-legend-item">
          <span className="pie-legend-dot" style={{ backgroundColor: "#dc3545" }} />
          <span className="pie-legend-label">Inactivos</span>
          <span className="count-inactivos pie-legend-num">{inactivos}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="dashboard-hero gestion-hero ">
        <BrandHeader />
        <h1>Informes y estadísticas</h1>
        <p style={{ maxWidth: "600px", margin: "0 auto" }}>
          Panel de informes para analizar socios activos, retención y datos de
          cuotas.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", justifyContent: "center" }}>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => navigate("/home")}
            style={{ gap: "0.4rem", display: "inline-flex", alignItems: "center" }}
          >
            ← Volver
          </Button>
          <Button
            variant="outline-light"
            size="sm"
            onClick={descargarPDF}
            disabled={!reporteFoto2 || generandoPDF}
            style={{ gap: "0.4rem", display: "inline-flex", alignItems: "center" }}
          >
            {generandoPDF ? (
              <><Spinner animation="border" size="sm" /> Generando...</>
            ) : (
              <><FaFilePdf style={{ color: "#dc3545" }} /> Descargar PDF</>
            )}
          </Button>
        </div>
      </header>

      {/* ERROR GENERAL */}
      {error && (
        <div className="alert alert-danger" style={{ margin: "1rem auto" }}>
          {error}
        </div>
      )}

      <div ref={pdfRef} style={{ padding: "1rem" }}>

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
                      variant="outline-light"
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
                      <>
                        <ResponsiveContainer width="100%" height={240}>
                          <PieChart>
                            <Pie
                              data={pieDataFoto1}
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={105}
                              dataKey="value"
                              label={renderLabel}
                              labelLine={false}
                              strokeWidth={2}
                              stroke="rgba(0,0,0,0.15)"
                            >
                              {pieDataFoto1.map((_, i) => (
                                <Cell key={i} fill={PIE_COLORS[i]} />
                              ))}
                              <Label
                                content={({ viewBox }) => {
                                  const { cx, cy } = viewBox;
                                  return (
                                    <text textAnchor="middle">
                                      <tspan x={cx} y={cy - 8} fontSize={28} fontWeight="bold" fill="#e6eef8">{reporteFoto1.resumen.totalSocios}</tspan>
                                      <tspan x={cx} y={cy + 14} fontSize={11} fill="#94a3b8">socios</tspan>
                                    </text>
                                  );
                                }}
                                position="center"
                              />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <PieLegend
                          activos={reporteFoto1.resumen.activos}
                          inactivos={reporteFoto1.resumen.inactivos}
                          total={reporteFoto1.resumen.totalSocios}
                        />
                      </>
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
                      variant="outline-light"
                      size="sm"
                      className="mb-3"
                      onClick={cargarFoto2}
                    >
                      Aplicar
                    </Button>

                    {reporteFoto2 ? (
                      <>
                        <ResponsiveContainer width="100%" height={240}>
                          <PieChart>
                            <Pie
                              data={pieDataFoto2}
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={105}
                              dataKey="value"
                              label={renderLabel}
                              labelLine={false}
                              strokeWidth={2}
                              stroke="rgba(0,0,0,0.15)"
                            >
                              {pieDataFoto2.map((_, i) => (
                                <Cell key={i} fill={PIE_COLORS[i]} />
                              ))}
                              <Label
                                content={({ viewBox }) => {
                                  const { cx, cy } = viewBox;
                                  return (
                                    <text textAnchor="middle">
                                      <tspan x={cx} y={cy - 8} fontSize={28} fontWeight="bold" fill="#e6eef8">{reporteFoto2.resumen.totalSocios}</tspan>
                                      <tspan x={cx} y={cy + 14} fontSize={11} fill="#94a3b8">socios</tspan>
                                    </text>
                                  );
                                }}
                                position="center"
                              />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <PieLegend
                          activos={reporteFoto2.resumen.activos}
                          inactivos={reporteFoto2.resumen.inactivos}
                          total={reporteFoto2.resumen.totalSocios}
                        />
                      </>
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

      </div>

    </div>
  );
}

export default Informes;
