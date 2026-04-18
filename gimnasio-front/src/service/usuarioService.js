const API_BASE = "http://localhost:3000/api/usuarios";
export async function getUsuarios() {
  const res = await fetch(`${API_BASE}/socios`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  const json = await res.json();
  return json;
}

export async function getUsuario(id) {
  const res = await fetch(`${API_BASE}/listar/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener usuario");
  const json = await res.json();
  return json;
}

