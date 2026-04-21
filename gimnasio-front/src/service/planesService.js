const API_BASE = "http://localhost:3000/api/planes";

export async function obtenerPlanes() {
    const res = await fetch(`${API_BASE}/admin/listar`, {
        credentials: "include",
    });
    if (res.status === 204) return null;
    const j = await res.json();
    if (j && j.success === false) throw new Error(j.error || "Error fetching planes");
    return j?.data ?? j;
}

export async function getPlan(id) {
    const res = await fetch(`${API_BASE}/admin/listar/${id}`, {
        credentials: "include",
    });
    if (res.status === 204) return null;
    const j = await res.json();
    if (j && j.success === false) throw new Error(j.error || "Error fetching plan");
    return j?.data ?? j;
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
    const res = await fetch(`${API_BASE}/admin/modificar/${id}`, {
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

export async function desactivarPlan(id) {
    const res = await fetch(`${API_BASE}/admin/desactivar/${id}`, {
        method: "PUT",
        credentials: "include",
    });
    if (res.status === 204) return null;
    const j = await res.json();
    if (j && j.success === false) throw new Error(j.error || "Error deactivating plan");
    return j?.data ?? j;
}