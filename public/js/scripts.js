const form = document.querySelector("#form-login");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();
  const mensaje = document.querySelector("#mensaje");
  try {
    const res = await fetch("/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Credenciales invalidas");
    }
    mensaje.innerHTML = `<p>"${"Login exitoso"}"</p>`;
    // Después de login exitoso:
    localStorage.setItem("usuarioActual", data.user.nombreUsuario || data.user.email); 
    // para que el frontend sepa quién es el usuario actual y guarde su carrito y su tema
    
    setTimeout(() => {
      window.location.href = "../productos.html";
    }, 1500);

    //si es administrador, redirigir a admin.html
    if (data.user.rol === "admin") {
      window.location.href = "../admin.html";
    }

  } catch (err) {
    mensaje.innerHTML = `<p>ERROR AL INICIAR SESION</p>`;
  }
});


