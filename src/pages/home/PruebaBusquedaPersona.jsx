import axios from 'axios';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from 'react-redux';

import { selectAuth } from '../../redux/slices/authSlice';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import useSidebar from '../../hooks/useSidebar';

import "react-toastify/dist/ReactToastify.css";
import '../../assets/css/layout.css';
import '../../assets/css/forms.css';

const dominio = import.meta.env.VITE_API_URL;

const PacientesCreate = () => {

    const { user, token } = useSelector(selectAuth);
    const { isSidebarOpen, toggleSidebar, sidebarRef } = useSidebar();
    const [inputValue, setInputValue] = useState('');
    const [personas, setPersonas] = useState([]);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [selectedPersonaId, setSelectedPersonaId] = useState(null);

    useEffect(() => {
    }, []);

    const handleSubmitPaciente = async (event) => {
        event.preventDefault();
    }

    const handleInputChange = (e) => {
        const query = e.target.value;
        setInputValue(query);
        if (query.length === 0 || query.length < 5) {
            setPersonas([]);
        } else {
            buscarPersonas(query);
        }
    };
    const buscarPersonas = async (query) => {
        if (query.length >= 5) {
            try {
                await axios.get(`${dominio}/api/private/pacientes/getAll_personas/${query}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => {
                    setPersonas(response.data.personas);
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            setPersonas([]);
        }
    };
    const handleSelectPersona = (persona) => {
        setSelectedPersona(persona);
        setSelectedPersonaId(persona.id);
        setInputValue(persona.nombres);
        setPersonas([]);
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
                        <h2>REGISTRAR PACIENTE</h2>
                        <form onSubmit={handleSubmitPaciente} >
                            <div className="form-group">
                                <label htmlFor="id_persona">Persona: </label>
                                <input
                                    id="buscador"
                                    type="text"
                                    className="form-control"
                                    placeholder="Ingrese el nombre de la persona"
                                    value={inputValue || ''}
                                    onChange={handleInputChange}
                                />
                                <p style={{ color: 'red', fontSize: '11px' }}>* Ingrese por lo menos 5 caracteres.</p>
                                {personas?.length > 0 && (
                                    <ul className="lista-personas">
                                        {personas.map((persona) => (
                                            <li
                                                key={persona.id}
                                                onClick={() => handleSelectPersona(persona)}
                                                className="resultado-persona"
                                            >
                                                {persona.nombres}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {selectedPersonaId && (
                                    <div className="info-container">
                                        <hr />
                                        <p className="info-label" style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>INFORMACIÓN</p>
                                        <hr />
                                        <p className="info-item">
                                            <span className="info-label">Nombres:</span>
                                            <span className="info-value">{selectedPersona.nombres}</span>
                                        </p>
                                        <p className="info-item">
                                            <span className="info-label">Documento:</span>
                                            <span className="info-value">{selectedPersona.documento}</span>
                                        </p>
                                    </div>
                                )}

                            </div>
                        </form>
                    </div>
                </section>
            </main>
            <ToastContainer closeButton={false} autoClose={2000} />
        </div>
    )
}

export default PacientesCreate