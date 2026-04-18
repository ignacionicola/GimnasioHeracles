const API_BASE = "http://localhost:3000/api/cuotas";

export async function getCuotas() {
  const res = await fetch(`${API_BASE}`, {
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || 'Error fetching cuotas');
  return j?.data ?? j;
}

export async function getCuota(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || 'Error fetching cuota');
  return j?.data ?? j;
}

export async function getCuotasPorSocio(idSocio) {
  const res = await fetch(`${API_BASE}/socio/${idSocio}`, {
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || 'Error fetching cuotas por socio');
  return j?.data ?? j;
}

export async function crearCuota(payload) {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || 'Error creating cuota');
  return j?.data ?? j;
}

export async function actualizarEstadoCuota(idCuota, payload) {
  const res = await fetch(`${API_BASE}/${idCuota}/estado`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || 'Error updating cuota estado');
  return j?.data ?? j;
}

export default { 
  getCuotas, 
  getCuota, 
  getCuotasPorSocio,
  crearCuota, 
  actualizarEstadoCuota 
};