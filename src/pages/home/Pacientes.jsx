import { useState, useEffect } from 'react';
import axios from 'axios';

import { FaPlusCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../redux/slices/authSlice';

import Sidebar from '../../pages/layout/Sidebar';
import Header from '../../pages/layout/Header';
import useSidebar from '../../hooks/useSidebar';

import "react-toastify/dist/ReactToastify.css";

import '../../assets/css/layout.css';
import '../../assets/css/table.css';
import '../../assets/css/forms.css';

const dominio = import.meta.env.VITE_API_URL;


const Pacientes = () => {

    const { token } = useSelector(selectAuth);
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState([]);
    const { isSidebarOpen, toggleSidebar, sidebarRef } = useSidebar();

    const handleCreateIncidencia = () => {
        navigate("/pacientes/create");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`${dominio}/api/private/pacientes/getAll_telemedicina`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => {
                    setPacientes(response.data.resultado);
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
                        <button onClick={handleCreateIncidencia}><FaPlusCircle className="icons-length" /> Registrar Paciente</button>
                        <div className="table-container">
                            <table className="my-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>DNI</th>
                                        <th>Nombres</th>
                                        <th>Edad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        pacientes?.map((paciente, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{paciente.documento}</td>
                                                <td>{paciente.nombres}</td>
                                                <td>{paciente.edad}</td>
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

export default Pacientes