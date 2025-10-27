import { Outlet } from "react-router-dom";
import style from "./styles/LayoutLogin.module.css";

function LayoutLogin() {
  return (
    <>
      <div className={style.layoutWrapper}>
        <div className="d-flex gap-3 titulo-gimnasio">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="54"
            height="54"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`escudoColor icon icon-tabler icons-tabler-outline icon-tabler-shield escudoColor`}
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
          </svg>
          <h1 className="">HERACLES</h1>
        </div>
        <p>Panel de administración - Personal autorizado</p>
        <div className={`${style.container} border-0 shadow-sm`}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default LayoutLogin;
