import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './pages/Home';
import AdminLogin from './pages/Login';
import Registro from './pages/Registro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de usuario/recepcionista */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas de administrador */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/home" element={<Home />} />
        <Route path="/admin/registro" element={<Registro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

