import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import BrandHeader from "../components/BrandHeader";
import "../styles/Informes.css";
import { getUsuariosActivos, SociosConCuota } from "../service/usuarioService";
import { FaUsers, FaCheckCircle, FaChartLine } from "react-icons/fa";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import InformeCard from "../components/InformeCard";
function Informes() {
  // -------------------------
  // Estados principales

  const [socios, setSocios] = useState([]); // todos los socios con datos de cuota
  const [activos, setActivos] = useState([]); // solo usuarios activos
  const [fechaDesde, setFechaDesde] = useState(""); // fecha desde para el período
  const [fechaHasta, setFechaHasta] = useState(""); // fecha hasta para el período
  const [loading, setLoading] = useState(true); // control de carga inicial
  const [error, setError] = useState(""); // mensaje de error si algo falla
const [modal, setModal] = useState({ show: false, titulo: "", usuarios: [] });

  // -------------------------
  // Carga de datos inicial

  const cargarDatosInformes = async () => {
    setLoading(true);
    setError("");

    try {
      // Esta llamada trae socios con la última cuota incluida
      const sociosConCuota = await SociosConCuota();
      setSocios(Array.isArray(sociosConCuota) ? sociosConCuota : []);

      // Esta llamada trae solo socios activos
      const sociosActivos = await getUsuariosActivos();
      setActivos(Array.isArray(sociosActivos) ? sociosActivos : []);
    } catch (err) {
      console.error("Error al cargar informes:", err);
      setError(err.message || "Error al cargar los datos de informes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosInformes();
  }, []);

  // Cálculos derivados

  const sociosConUltimaCuota = useMemo(() => {
    return socios.map((socio) => {
      const cuotas = Array.isArray(socio.Cuota) ? socio.Cuota : [];
      const ultimaCuota = cuotas.length > 0 ? cuotas[cuotas.length - 1] : null;
      return { ...socio, ultimaCuota };
    });
  }, [socios]);

  const totalSocios = sociosConUltimaCuota.length;
  const totalActivos = activos.length;
  const totalInactivos = Math.max(0, totalSocios - totalActivos);
  const porcentajeRetencion =
    totalSocios === 0 ? 0 : Math.round((totalActivos / totalSocios) * 100);

  // -------------------------
  // Filtro por período
  
  const sociosFiltradosPorPeriodo = useMemo(() => {
    if (!fechaDesde && !fechaHasta) {
      return sociosConUltimaCuota;
    }

    const desde = fechaDesde ? new Date(fechaDesde) : null;
    const hasta = fechaHasta ? new Date(fechaHasta) : null;

    return sociosConUltimaCuota.filter((socio) => {
      const fechaPago =
        socio.ultimaCuota?.fechaPago || socio.ultimaCuota?.createdAt || null;
      if (!fechaPago) return false;

      const fecha = new Date(fechaPago);
      if (desde && fecha < desde) return false;
      if (hasta && fecha > hasta) return false;
      return true;
    });
  }, [fechaDesde, fechaHasta, sociosConUltimaCuota]);

  // Totales aplicados al período seleccionado
const totalSociosPeriodo = sociosFiltradosPorPeriodo.length;
const totalActivosPeriodo = sociosFiltradosPorPeriodo.filter(
  (socio) => socio.activo,
).length;
const porcentajeRetencionPeriodo =
  totalSociosPeriodo === 0
    ? 0
    : Math.round((totalActivosPeriodo / totalSociosPeriodo) * 100);

    /* CREANDO GRAFICO DE PASTEL */
const pieDataGeneral = [
  { name: "Activos", value: totalActivos },
  { name: "Inactivos", value: totalInactivos },
];
const pieDataPeriodo = [
  { name: "Activos", value: totalActivosPeriodo },
  { name: "Inactivos", value: totalSociosPeriodo - totalActivosPeriodo },
];
const PIE_COLORS = ["#28a745", "#dc3545"];

const handleClickPieGeneral = (_, index) => {
  if (index === 0) {
    setModal({ show: true, titulo: "Socios Activos", usuarios: activos });
  } else {
    const inactivos = sociosConUltimaCuota.filter((s) => !s.activo);
    setModal({ show: true, titulo: "Socios Inactivos", usuarios: inactivos });
  }
};
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={13} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

    // Componentes 

  if (loading) {
    return (
      <div className="loading">
        <Spinner animation="border" role="status" />
        <span style={{ marginLeft: "0.75rem" }}>Cargando informes...</span>
      </div>
    );
  }

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

      {/* FILTROS DE PERÍODO */}
      <section className="mb-4" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Row className="align-items-end">
          <Col xs={12} md={5}>
            <Form.Group>
              <Form.Label>Desde</Form.Label>
              <div className="date-input-wrapper">
                <Form.Control
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  placeholder="dd/mm/aaaa"
                />
              </div>
            </Form.Group>
          </Col>
          <Col xs={12} md={5}>
            <Form.Group>
              <Form.Label>Hasta</Form.Label>
              <div className="date-input-wrapper">
                <Form.Control
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  placeholder="dd/mm/aaaa"
                />
              </div>
            </Form.Group>
          </Col>
          <Col xs={12} md={2} className="d-flex justify-content-end">

            <Button
              variant="primary"
              onClick={() => cargarDatosInformes()}
              style={{ marginTop: "0.35rem" }}
            >
              Descargar PDF 
            </Button>
          </Col>
          
        </Row>
      </section>

      {/* RESUMEN DE INDICADORES */}
      <section
        className="mb-5"
        style={{ maxWidth: "1100px", margin: "0 auto" }}
      >
        <Row className="g-4 justify-content-center">
          <Col xs={12} md={4} lg={4}>
            <InformeCard
              title="Total de socios"
              value={totalSociosPeriodo}
             /*   description="Socios registrados con cuota en el sistema."*/
              icon={<FaUsers size={24} />}
            />
          </Col>

          <Col xs={12} md={4} lg={4}>
            <InformeCard
              title="Socios activos"
              value={totalActivosPeriodo}
             /* description="Socios con estado activo en el sistema."*/
              icon={<FaCheckCircle size={24} />}
            />
          </Col>

          <Col xs={12} md={4} lg={4}>
            <InformeCard
              title="Retención"
              value={`${porcentajeRetencionPeriodo}%`}
             /* description="Porcentaje de socios activos sobre el total."*/
              icon={<FaChartLine size={24} />}
            />
          </Col>
        </Row>
      </section>

      {/* TABLA DE SOCIOS FILTRADOS POR PERÍODO */}
      <section style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title>Socios en el período </Card.Title>
            {sociosFiltradosPorPeriodo.length === 0 ? (
              <div style={{ padding: "1.5rem", color: "#6c757d" }}>
                No se encontraron socios para el período seleccionado.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>DNI</th>
                      <th>Nombre</th>
                      <th>Plan</th>
                      <th>Fecha último pago</th>
                      <th>Vencimiento</th>
                      <th>Estado socio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sociosFiltradosPorPeriodo.map((socio) => {
                      const ultima = socio.ultimaCuota;
                      return (
                        <tr key={socio.dni || socio.id}>
                          <td>{socio.dni || "N/A"}</td>
                          <td>{`${socio.nombre || ""} ${socio.apellido || ""}`}</td>
                          <td>{ultima?.nombrePlan || "Sin plan"}</td>
                          <td>
                            {ultima?.fechaPago
                              ? new Date(ultima.fechaPago).toLocaleDateString(
                                  "es-AR",
                                )
                              : "N/A"}
                          </td>
                          <td>
                            {ultima?.fechaVencimiento
                              ? new Date(
                                  ultima.fechaVencimiento,
                                ).toLocaleDateString("es-AR")
                              : "N/A"}
                          </td>
                          <td>
                            {socio.activo ? "Activo" : "Inactivo"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Body>
        </Card>
      </section>
  

<Modal show={modal.show} onHide={() => setModal({ ...modal, show: false })} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>{modal.titulo}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {modal.usuarios.length === 0 ? (
      <p>No hay socios en esta categoría.</p>
    ) : (
      <table className="styled-table mb-0 w-100 ">
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

      {/* -------------------------
          aca voy a poner los graficos 
          pero tengo q ver como hacerlos 
          
      ------------------------- */}
      <section
        className="mt-5"
        style={{ maxWidth: "1100px", margin: "0 auto" }}
      >
        <Card className="shadow-sm">
<Card.Body>
  <Card.Title>Distribución de socios</Card.Title>
  <Row className="justify-content-center">
    <Col xs={12} md={6} className="text-center">
      <h6>Socios actuales</h6>
      <PieChart width={300} height={260}>
       <Pie data={pieDataGeneral} cx={150} cy={120} outerRadius={90} dataKey="value"
        onClick={handleClickPieGeneral}
        style={{ cursor: "pointer" }}
          label={renderLabel}
labelLine={false}>
          {pieDataGeneral.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
        </Pie>
  
        <Tooltip /><Legend />
      </PieChart>
    </Col>
    <Col xs={12} md={6} className="text-center">
      <h6>Período seleccionado</h6>
      <PieChart width={300} height={260}>
        <Pie data={pieDataPeriodo} cx={150} cy={120} outerRadius={90} dataKey="value"
          label={renderLabel}
labelLine={false}>
          {pieDataPeriodo.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
        </Pie>
        <Tooltip /><Legend />
      </PieChart>
    </Col>
  </Row>
</Card.Body>

        </Card>
      </section>
    </div>
  );
}

export default Informes;