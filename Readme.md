# Gimnasio Heracles – Proyecto Integrador II

Sistema completo (backend + frontend) para gestionar socios, asistencias y recompensas del Gym Heracles.  
Incluye autenticación diferenciada para personal y socios, alta de usuarios 

## Requisitos
- **Node.js 18+** (se usa ECMAScript moderno en backend y Vite en frontend)
- **npm** 
- **SQLite** (se usa `database.sqlite` en el root; Sequelize lo crea automáticamente)

## Estructura del repo
```
EcommerceIgnacio/
├── app.js                 # servidor Express (puerto 3000)
├── database.sqlite        # base SQLite (se genera sola)
├── gimnasio-front/        # app React + Vite
└── src/                   # controladores, modelos, rutas, servicios
```

## Configuración inicial
1. **Clonar o descargar** el repositorio.
2. **Crear un archivo `.env`** en el root con al menos:
   ```bash
   PORT=3000
   JWT_SECRET=super-secreto
   JWT_EXPIRES_IN=1h
   ```
3. Instalar dependencias del backend:
   ```bash
   npm install
   ```
4. Instalar dependencias del frontend:
   ```bash
   cd gimnasio-front
   npm install
   cd ..
   ```

## Ejecutar en desarrollo
En dos terminales distintas:

```bash
# Terminal 1 – Backend
npm run dev
# http://localhost:3000

# Terminal 2 – Frontend
cd gimnasio-front
npm run dev
# http://localhost:5173
```

El backend tiene CORS abierto para `http://localhost:5173` y expone las rutas bajo `/api/usuarios` y `/api/auth`.

## Flujo básico para un nuevo colaborador
1. **Registrar usuario del sistema**  
   - Abrir `http://localhost:5173/register`.
   - Completar formulario (rol recepcionista/administrador).
2. **Iniciar sesión de personal**  
   - `http://localhost:5173/login` → ingresa usuario + contraseña.
   - El dashboard muestra accesos rápidos (Registrar socio / Panel de socios).
3. **Registrar socio**  
   - Botón “Ir a Registro” o ruta `http://localhost:5173/registro`.
4. **Ingreso por DNI**  
   - `http://localhost:5173/ingreso` valida DNI, registra asistencia y redirige al panel de puntos.

Todos los fetch del frontend apuntan al backend en `http://localhost:3000`, por lo que ambos procesos deben estar corriendo.

## Scripts útiles
| Ubicación        | Script          | Descripción                                    |
|-----------------|-----------------|------------------------------------------------|
| root            | `npm run dev`   | Levanta backend Express con nodemon            |
| root            | `npm start`     | Backend en modo producción                     |
| gimnasio-front  | `npm run dev`   | Dev server de Vite (hot reload)                |
| gimnasio-front  | `npm run build` | Build de producción del frontend               |


## Notas
- `sequelize.sync()` crea/actualiza la base SQLite, por lo que no hay migraciones manuales.
- Si cambias la URL del frontend/backend, actualizá el `origin` de CORS en `app.js` y los `fetch` del frontend.


¡Listo! Con estos pasos cualquier colaborador puede clonar el repo y ejecutar exactamente el mismo flujo que tenemos localmente. 
