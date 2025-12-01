const API_BASE = "http://localhost:3000/api/beneficios";

export async function getBeneficios() {
  const res = await fetch(`${API_BASE}/admin/listar`, {
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || 'Error fetching beneficios');
  return j?.data ?? j;
}

export async function getBeneficio(id) {
  const res = await fetch(`${API_BASE}/admin/listar/${id}`, {
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || 'Error fetching beneficio');
  return j?.data ?? j;
}

export async function crearBeneficio(payload) {
  const res = await fetch(`${API_BASE}/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || 'Error creating beneficio');
  return j?.data ?? j;
}

export async function modificarBeneficio(id, payload) {
  const res = await fetch(`${API_BASE}/admin/modificar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || 'Error modifying beneficio');
  return j?.data ?? j;
}

export async function desactivarBeneficio(id) {
  const res = await fetch(`${API_BASE}/admin/desactivar/${id}`, {
    method: "PUT",
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || 'Error deactivating beneficio');
  return j?.data ?? j;
}

export async function activarBeneficio(id) {
  const res = await fetch(`${API_BASE}/admin/activar/${id}`, {
    method: "PUT",
    credentials: "include",
  });
  if (res.status === 204) return null;
  const j = await res.json();
  if (j && j.success === false) throw new Error(j.error || 'Error activating beneficio');
  return j?.data ?? j;
}

export default { getBeneficios, getBeneficio, crearBeneficio, modificarBeneficio, desactivarBeneficio, activarBeneficio };

