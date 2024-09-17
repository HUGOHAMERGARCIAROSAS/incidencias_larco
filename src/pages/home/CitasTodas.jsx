import { useState, useEffect } from 'react';
import axios from 'axios';

import { FaPlusCircle } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { selectAuth } from '../../redux/slices/authSlice';

import Sidebar from '../../pages/layout/Sidebar';
import Header from '../../pages/layout/Header';
import useSidebar from '../../hooks/useSidebar';

import "react-toastify/dist/ReactToastify.css";

import '../../assets/css/layout.css';
import '../../assets/css/table.css';
import '../../assets/css/forms.css';
import { useNavigate } from 'react-router-dom';

const dominio = import.meta.env.VITE_API_URL;


const CitasTodas = () => {



    const { user, token } = useSelector(selectAuth);
    const [citas, setCitas] = useState([]);
    const { isSidebarOpen, toggleSidebar, sidebarRef } = useSidebar();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`${dominio}/api/private/citas/getCitasTelemedicina/${user.per_codigo}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => {
                    setCitas(response.data.resultado);
                });

            } catch (error) {
                console.log(error);
            }
        }

        fetchData();

    }, []);

    const handlePrint = (id_cita) => {
        navigate(`/receta_medica/${id_cita}`);
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
                        <div className="table-container">
                            <table className="my-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>DNI</th>
                                        <th>Nombres</th>
                                        <th>Fecha</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        citas?.map((cita, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{cita.dni_paciente}</td>
                                                <td>{cita.paciente}</td>
                                                <td>{cita.fecha}</td>
                                                <td><button type="button" className="btn btn-primary" onClick={() => handlePrint(cita.id_cita)}>Imprimir cita </button></td>
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

export default CitasTodas