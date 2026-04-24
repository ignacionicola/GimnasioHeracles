const API_BASE = "http://localhost:3000/api/usuarios";
// get /api/usuarios/socios
export async function getUsuarios() {
  const res = await fetch(`${API_BASE}/socios`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  const json = await res.json();
  return json;
}
/*
export async function getUsuario(id) {
  const usuarios = await getUsuarios();
  if (!Array.isArray(usuarios)) return null;
  return usuarios.find((u) => String(u.id) === String(id)) ?? null;
}
*/

export async function getUsuariosActivos() {
  const res = await fetch(`${API_BASE}/socios/activos`, {
    credentials: "include",
  });
  if (res.status === 204) return null;
  const json = await res.json();
  if (!res.ok || json?.success === false) {
    throw new Error(json?.error || "Error al obtener usuarios activos");
  }
  return json?.data ?? json;
}
// POST /api/usuarios/register
export async function registrarSocio(payload) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (res.status === 204) return null;
  const json = await res.json();
  if (!res.ok || json?.success === false) {
    throw new Error(json?.error || "Error al registrar socio");
  }
  return json?.data ?? json;
}
// POST /api/usuarios/login
export async function loginUsuario(payload) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (res.status === 204) return null;
  const json = await res.json();
  if (!res.ok || json?.success === false) {
    throw new Error(json?.error || "Error al iniciar sesion");
  }
  return json?.data ?? json;
}
// POST /api/usuarios/logout
export async function logoutUsuario() {
  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (res.status === 204) return null;
  const json = await res.json();
  if (!res.ok || json?.success === false) {
    throw new Error(json?.error || "Error al cerrar sesion");
  }
  return json?.data ?? json;
}
// POST /api/usuarios/system/register
export async function registrarUsuarioSistema(payload) {
  const res = await fetch(`${API_BASE}/system/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (res.status === 204) return null;
  const json = await res.json();
  if (!res.ok || json?.success === false) {
    throw new Error(json?.error || "Error al registrar usuario del sistema");
  }
  return json?.data ?? json;
}
export async function SociosConCuota() {
  const res = await fetch(`${API_BASE}/socios/cuota`, {
    credentials: "include",
  });
  if (res.status === 204) return null;
  const json = await res.json();
  if (!res.ok || json?.success === false) {
    throw new Error(json?.error || "Error al obtener socios con cuota");
  }
  return json?.data ?? json;
}
// PUT /api/usuarios/:id
export async function actualizarUsuario(id, payload) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (res.status === 204) return null;
  const json = await res.json();
  if (!res.ok || json?.success === false) {
    throw new Error(json?.error || "Error al actualizar usuario");
  }
  return json?.data ?? json;
}
export default {
  getUsuarios,
  getUsuariosActivos,
  registrarSocio,
  loginUsuario,
  logoutUsuario,
  registrarUsuarioSistema,
  actualizarUsuario,
  SociosConCuota,
};