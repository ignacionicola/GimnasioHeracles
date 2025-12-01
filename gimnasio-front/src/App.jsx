import { BrowserRouter, Routes, Route } from "react-router-dom";
import IngresoSocio from "./pages/IngresoSocio";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Registro from "./pages/Registro";
import PanelSocio from "./pages/PanelSocio";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IngresoSocio />} />
        <Route path="/ingreso" element={<IngresoSocio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/panel-socio" element={<PanelSocio />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

