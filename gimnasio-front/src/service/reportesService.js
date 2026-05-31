const API_BASE = "http://localhost:3000/api/reportes";

export async function getReporte(fecha) {
  const res = await fetch(`${API_BASE}/reporte?fecha=${fecha}`, {
    credentials: "include",
  });
  if (res.status === 204) return null;
  const json = await res.json();
  if (!res.ok || json?.success === false) {
    throw new Error(json?.error || "Error al obtener el reporte");
  }
  return json?.data;
}
