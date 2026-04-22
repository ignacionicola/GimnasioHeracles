import { BrowserRouter, Routes, Route } from "react-router-dom";
/* Rutas de la aplicación */
import IngresoSocio from "./pages/IngresoSocio";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Registro from "./pages/Registro";
import PanelSocio from "./pages/PanelSocio";
import Beneficios from "./pages/Beneficios";
import GestionUsuario from "./pages/GestionUsuario";
import Planes from "./pages/Planes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IngresoSocio />} />
        <Route path="/planes" element={<Planes />} />
        <Route path="/ingreso" element={<IngresoSocio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/panel-socio" element={<PanelSocio />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/beneficios" element={<Beneficios />} />
        <Route path="/usuario" element={<GestionUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
