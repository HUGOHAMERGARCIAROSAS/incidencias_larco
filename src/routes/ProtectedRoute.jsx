import { Navigate, Outlet, useLocation  } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {

  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

   // Si no está autenticado, redirigir a la página de inicio de sesión
   if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Si está autenticado, renderizar la ruta solicitada
  return <Outlet />;
};

export default ProtectedRoute;
