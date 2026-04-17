const API_BASE = "http://localhost:3000/api/usuarios";
export async function getUsuarios() {
  const res = await fetch(`${API_BASE}/socios`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  const json = await res.json();
  return json;
}