import { useState } from 'react';
import axios from 'axios';
import { FaRegSave } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from 'react-redux';

import Sidebar from '../../pages/layout/Sidebar';
import Header from '../../pages/layout/Header';
import { selectAuth } from '../../redux/slices/authSlice';
import useSidebar from '../../hooks/useSidebar';

import "react-toastify/dist/ReactToastify.css";
import '../../assets/css/layout.css';
import '../../assets/css/forms.css';


const dominio = import.meta.env.VITE_API_URL;
const MisDatos = () => {

  const { user, token } = useSelector(selectAuth);
  const { isSidebarOpen, toggleSidebar, sidebarRef } = useSidebar();
  const [datos, setDatos] = useState({
    per_codigo: user?.per_codigo,
    password: "",
    password_confirm: ""
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const handleSubmitPassword = (e) => {
    e.preventDefault();

    if (datos.password !== datos.password_confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      axios.post(`${dominio}/api/private/user/updatePassword`, datos, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          toast.success("Contraseña actualizada exitosamente");
          setDatos({
            ...datos,
            password: "",
            password_confirm: ""
          })
        })
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div className={`container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div ref={sidebarRef}>
        <Sidebar isOpen={isSidebarOpen} />
      </div>
      <main className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        <section className="stats">
          <div className="form-container">
            <h2>MIS DATOS</h2>
            <div className="form-group">
              <label htmlFor="name">Nombres</label>
              <input type="text" id="name" name="name" placeholder="Ingresa tu nombre" value={user?.nombres || ""} required readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="email">Usuario</label>
              <input type="email" id="email" name="email" placeholder="Ingresa tu correo electrónico" value={user?.per_login || ""} required readOnly />
            </div>
            <form onSubmit={handleSubmitPassword}>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="Ingresa tu contraseña" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="password_confirm">Confirmar contraseña</label>
                <input type="password" id="password_confirm" name="password_confirm" placeholder="Confirmar tu contraseña" onChange={handleChange} required />
              </div>
              <button type="submit"><FaRegSave className='icons-length' size={15} /> Enviar</button>
            </form>
          </div>
        </section>
      </main>
      <ToastContainer closeButton={false} autoClose={2000} />
    </div>
  )
}

export default MisDatos