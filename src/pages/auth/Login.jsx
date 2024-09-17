import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, selectAuth } from "../../redux/slices/authSlice";

import { FaRegPlusSquare, FaSignInAlt } from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/css/login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading } = useSelector(selectAuth);

  const [credentials, setCredentials] = useState({
    per_login: "",
    password: ""
  });

  const baseUrl = import.meta.env.BASE_URL;

  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setCredentials({ ...credentials, per_login: savedUsername });
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (credentials.per_login === "" || credentials.password === "") {
      toast.error("Por favor, rellene todos los campos");
      return;
    }

    try {
      const loginPromise = dispatch(loginUser(credentials)).unwrap();

      toast.promise(
        loginPromise,
        {
          pending: "Iniciando sesión...",
          success: "¡Inicio de sesión exitoso!",
          error: "Error al iniciar sesión",
        },
        {
          position: "top-center",
        }
      );

      await loginPromise;

      if (rememberMe) {
        localStorage.setItem("username", credentials.per_login);
      } else {
        localStorage.removeItem("username");
      }

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Usuario no encontrado o credenciales incorrectas.");
      } else {
        toast.error(error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      const { from } = location.state || { from: { pathname: "/dashboard" } };
      navigate(from.pathname);
    }
  }, [user, location.state, navigate]);

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="form-content">
          <img src={`${baseUrl}images/login/mdvlh.png`} />
          <h1>INICIAR SESIÓN</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="text"
                placeholder="Usuario"
                className="input"
                name="per_login"
                value={credentials.per_login}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                placeholder="Contraseña"
                className="input"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMe}
                />
                Recordarme
              </label>
              <a href="#" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="login-button"
            ><FaSignInAlt size={15} style={{ marginRight: "5px", marginLeft: "5px" }} />
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
            {/* <button type="button" className="register-button" onClick={() => navigate("/register")}><FaRegPlusSquare size={15} style={{ marginRight: "5px", marginLeft: "5px" }} /> Registrarse</button> */}
          </form>
        </div>
      </div>
      <div className="login-image">
        <div className="overlay">
          <h2>Telemedicina con Clement</h2>
          <p className="login-description">
            Es el servicio que ofrece la municipalidad distrital de Victor Larco Herrera que permite registrar y gestionar las consultas médicas de los vecinos.
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
