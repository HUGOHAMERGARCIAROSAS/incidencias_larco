import { useState, useEffect } from 'react';
import axios from 'axios';

import { FaPlusCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../redux/slices/authSlice';

import Sidebar from '../../pages/layout/Sidebar';
import Header from '../../pages/layout/Header';
import useSidebar from '../../hooks/useSidebar';

import '../../assets/css/layout.css';
import '../../assets/css/table.css';
import '../../assets/css/forms.css';

const dominio = import.meta.env.VITE_API_URL;


const Incidencias = () => {

  const { user, token } = useSelector(selectAuth);
  const navigate = useNavigate();
  const [incidencias, setIncidencias] = useState([]);
  const { isSidebarOpen, toggleSidebar, sidebarRef } = useSidebar();


  const handleCreateIncidencia = () => {
    navigate("/incidencias/create");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(`${dominio}/api/private/incidencias/getAll/${user.per_codigo}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(response => {
          setIncidencias(response.data.resultado);
        });

      } catch (error) {
        console.log(error);
      }
    }

    fetchData();

  }, []);

  return (
    <div className={`container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div ref={sidebarRef}>
        <Sidebar isOpen={isSidebarOpen} />
      </div>
      <main className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        <section className="stats">
          <div className="form-container">
            <div className="table-container">
              <button className="btn-secondary" onClick={handleCreateIncidencia}><FaPlusCircle className="icons-length" /> Nueva Incidencia</button>
              <table className="my-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    incidencias.map((incidencia, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{incidencia.tipoincidencia}</td>
                        <td>{incidencia.fecha}</td>
                        <td>{incidencia.hora}</td>
                        <td>{incidencia.estado}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Incidencias