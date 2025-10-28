import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
function Registro() {
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    let registroNombre = e.target[0];
    let registroEmail = e.target[1];
    let registroTelefono = e.target[2];
    let registroPassword = e.target[3];
    const respuesta = await register(
      registroNombre.value.trim(),
      registroEmail.value.trim(),
      registroPassword.value.trim(),
      registroTelefono.value.trim()
    );
    console.log(respuesta);
    if (respuesta.success) {
      registroNombre.value = "";
      registroEmail.value = "";
      registroPassword.value = "";
      registroTelefono.value = "";
      document.querySelector("#resultado").innerHTML = `Registro exitoso`;
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      manejoRespuesta(respuesta.details);
      setTimeout(() => {
        document.querySelector("#resultado").innerHTML = ``;
      }, 1500);
    }
  };

  const manejoRespuesta = (respuesta) => {
    document.querySelector("#nombreUsuarioError").innerHTML = ``;
    document.querySelector("#correoUsuarioError").innerHTML = ``;
    document.querySelector("#telefonoError").innerHTML = ``;
    document.querySelector("#contraseniaError").innerHTML = ``;
    let i = 0;
    for (i = 0; i < respuesta.length; i++) {
      if (respuesta[i].path == "nombreUsuario") {
        document.querySelector(
          "#nombreUsuarioError"
        ).innerHTML = `Minimo 5 caracteres y maximo 15 caracteres`;
      }
      if (respuesta[i].path == "correoUsuario") {
        document.querySelector(
          "#correoUsuarioError"
        ).innerHTML = `El email es requerido`;
      }
      if (respuesta[i].path == "telefonoUsuario") {
        document.querySelector(
          "#telefonoError"
        ).innerHTML = `El telefono es requerido`;
      }
      if (respuesta[i].path == "contrasenia") {
        document.querySelector(
          "#contraseniaError"
        ).innerHTML = `Contraseña minimo 6 caracteres`;
      }
    }
  };
  return (
    <>
      <h1 className="text-center">Registro de personal</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicNombreUsuario">
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control type="text" placeholder="Nombre de usuario..." />
          <div className="errorForm" id="nombreUsuarioError"></div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Email..." />
          <div id="correoUsuarioError" className="errorForm"></div>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicTelefono">
          <Form.Label>Telefono</Form.Label>
          <Form.Control type="text" placeholder="Telefono" />
          <div id="telefonoError" className="errorForm"></div>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" placeholder="Contraseña" />
          <div id="contraseniaError" className="errorForm"></div>
        </Form.Group>
        <div className="my-3 d-flex gap-2 justify-content-center container-botones-login">
          <button type="submit" className="gradiente">
            Completar registro
          </button>
          <button
            type="button"
            className="gradiente-registro"
            onClick={() => navigate("/")}
          >
            Volver a Login
          </button>
        </div>
        <div id="resultado"></div>
      </Form>
    </>
  );
}

export default Registro;
