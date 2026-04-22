/*const API_BASE = "http://localhost:3000/api/cuotas";

export async function getCuotas() {
  // get /api/cuotas
  const res = await fetch(`${API_BASE}`, {
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || 'Error fetching cuotas');
  return j?.data ?? j;
}
  
/*
export async function getCuota(idSocio) {
  // get /api/cuotas/:idSocio
  const res = await fetch(`${API_BASE}/${idSocio}`, {
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

export async function obtenerUltimaCuotaPorSocio(idSocio) {
  // get /api/cuotas/socio/:idSocio/ultima
  const res = await fetch(`${API_BASE}/socio/${idSocio}/ultima`, {
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || 'Error fetching ultima cuota por socio');
  return j?.data ?? j;
}

export async function crearCuota(payload) {
  // post /api/cuotas/renovar
  const res = await fetch(`${API_BASE}/renovar`, {
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
  // put /api/cuotas/:idCuota/estado
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
   
  getCuotasPorSocio,
  crearCuota, 
  obtenerUltimaCuotaPorSocio,
actualizarEstadoCuota 
};
*/
const API_BASE = "http://localhost:3000/api/cuotas";
/*
async function parseResponse(res, defaultMessage) {
  if (res.status === 204) return null;

  const raw = await res.text();
  const json = raw ? JSON.parse(raw) : null;

  if (!res.ok || json?.success === false) {
    throw new Error(json?.error || defaultMessage);
  }

  return json?.data ?? json;
}

export async function getCuotas() {
  // GET /api/cuotas (última cuota de cada socio)
  const res = await fetch(`${API_BASE}`, {
    credentials: "include",
  });
  return parseResponse(res, "Error fetching cuotas");
}

export async function getCuotasPorSocio(idSocio) {
  // GET /api/cuotas/:idSocio
  const res = await fetch(`${API_BASE}/${idSocio}`, {
    credentials: "include",
  });
  return parseResponse(res, "Error fetching cuotas por socio");
}

export async function crearCuota(payload) {
  // POST /api/cuotas/renovar
  const res = await fetch(`${API_BASE}/renovar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  return parseResponse(res, "Error creating cuota");
}

export async function actualizarEstadoCuota(idCuota, payload) {
  // PUT /api/cuotas/:idCuota/estado
  const res = await fetch(`${API_BASE}/${idCuota}/estado`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  return parseResponse(res, "Error updating cuota estado");
}

export default {
  getCuotas,
  getCuotasPorSocio,
  crearCuota,
  actualizarEstadoCuota,
};*/
export async function getCuotas() {
  const res = await fetch(`${API_BASE}`, {
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || "Error fetching cuotas");
  return j?.data ?? j;
}

export async function getCuotasPorSocio(idSocio) {
  const res = await fetch(`${API_BASE}/${idSocio}`, {
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || "Error fetching cuotas por socio");
  return j?.data ?? j;
}

export async function crearCuota(payload) {
  const res = await fetch(`${API_BASE}/renovar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || "Error creating cuota");
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
  if (j && j.success === false) throw new Error(j.error || "Error updating cuota estado");
  return j?.data ?? j;
}

export default {
  getCuotas,
  getCuotasPorSocio,
  crearCuota,
  actualizarEstadoCuota,
};