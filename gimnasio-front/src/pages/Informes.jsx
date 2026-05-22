import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import BrandHeader from "../components/BrandHeader";
import "../styles/Informes.css";
import { getUsuariosActivos, SociosConCuota } from "../service/usuarioService";
import { FaUsers, FaCheckCircle, FaChartLine } from "react-icons/fa";
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
            <Card.Title>Gráficos</Card.Title>
            <Card.Text>
              aca en teoria va los graficos:
              <ul>
              </ul>
            </Card.Text>
            
          </Card.Body>
        </Card>
      </section>
    </div>
  );
}

export default Informes;