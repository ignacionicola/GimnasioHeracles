const API_BASE = "http://localhost:3000/api/planes";

export async function obtenerPlanes() {
    // get /api/planes
    const res = await fetch(`${API_BASE}/`, {
        credentials: "include",
    });
    if (res.status === 204) return null;
    const j = await res.json();
    if (j && j.success === false) throw new Error(j.error || "Error fetching planes");
    return j?.data ?? j;
}

export async function getPlan(id) {
    // get /api/planes/:id
    // no existe el endpoint creo pero por la dudas
    const planes = await obtenerPlanes();
    if (!Array.isArray(planes)) return null;
    return planes.find((p) => String(p.id) === String(id)) ?? null;
  }

export async function crearPlan(payload) {
    const res = await fetch(`${API_BASE}/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
    });
    if (res.status === 204) return null;
    const j = await res.json();
    if (j && j.success === false) throw new Error(j.error || "Error creating plan");
    return j?.data ?? j;
}

export async function actualizarPlan(id, payload) {
    // put /api/planes/:id
    const res = await fetch(`${API_BASE}/admin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
    });
    if (res.status === 204) return null;
    const j = await res.json();
    if (j && j.success === false) throw new Error(j.error || "Error modifying plan");
    return j?.data ?? j;
}
/*
export async function desactivarPlan(id) {
    const res = await fetch(`${API_BASE}/admin/desactivar/${id}`, {
        method: "PUT",
        credentials: "include",
    });
    if (res.status === 204) return null;
    const j = await res.json();
    if (j && j.success === false) throw new Error(j.error || "Error deactivating plan");
    return j?.data ?? j;
}*/
