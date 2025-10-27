import { Button, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Spinner } from "react-bootstrap";
function Login() {
  const { setCargando, cargando } = useAuthStore();
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando();
    const nombreUsuario = e.target[0].value;
    const contrasenia = e.target[1].value;
    try {
      const data = await login({ nombreUsuario, contrasenia });
      if (data?.success) {
        setTimeout(() => {
          setCargando();
          navigate("/home");
        }, 1000);
      } else {
        setCargando();
        const resultado = document.getElementById("resultado");
        resultado.innerHTML = "Usuario o contraseña incorrectos";
      }
    } catch (error) {
      console.error(error);
      setCargando();
    }
  };

  return (
    <Form className={`d-flex flex-column`} onSubmit={handleSubmit}>
      <h1 className={`my-1 text-center h1`}>Acceso del Personal</h1>
      <Form.Group
        className="justify-content-center my-3"
        controlId="form-email"
      >
        <label htmlFor="">Usuario</label>
        <Form.Control type="text" placeholder="🔐 Ingrese su nombre de usuario" />
      </Form.Group>
      <Form.Group className="">
        <label htmlFor="">Contraseña</label>

        <Form.Control type="password" placeholder="🔑 Ingrese su contraseña" />
      </Form.Group>
      <div id="resultado" className="text-center"></div>

      <div className="my-3 d-flex gap-2 justify-content-center container-botones-login">
        <button type="submit" className="gradiente">
          Iniciar sesion
        </button>
        <button type="button" className="gradiente-registro" onClick={() => navigate("/register")}>
          Registrarse
        </button>
      </div>
      <div className="spinner">
        {cargando ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          ""
        )}
      </div>
    </Form>
  );
}

export default Login;
