import axios from 'axios';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";

import Sidebar from '../../pages/layout/Sidebar';
import Header from '../../pages/layout/Header';

import '../../assets/css/layout.css';
import '../../assets/css/forms.css';
import '../../assets/css/table.css';
import "react-toastify/dist/ReactToastify.css";

import { useSelector } from 'react-redux';
import { selectAuth } from '../../redux/slices/authSlice';

import useSidebar from '../../hooks/useSidebar';
import useFetchData from '../../hooks/useFetchData';

import CitaForm from './CitaForm';

const dominio = import.meta.env.VITE_API_URL;

const MisCitas = () => {
    const { user, token } = useSelector(selectAuth);
    const { isSidebarOpen, toggleSidebar, sidebarRef } = useSidebar();
    const { data: pacientes } = useFetchData(`${dominio}/api/private/telemedicina/getPacientesTelemedicina`, token);
    const [loading, setLoading] = useState(false);
    const [datos, setDatos] = useState({
        fecha: "",
        id_paciente: "",
        id_medico: user.per_codigo,
        peso: "",
        talla: "",
        indicaciones: "",
        detalleCitas: []
    });

    const [datosDetalle, setDatosDetalle] = useState({
        horario: "",
        medicamento: ""
    });

    const [detalleCitas, setDetalleCitas] = useState([]);
    const [readyToSubmit, setReadyToSubmit] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "peso" || name === "talla") {
            const regex = /^[0-9]*\.?[0-9]*$/;

            if (regex.test(value)) {
                setDatos({
                    ...datos,
                    [name]: value,
                });
            }
        } else {
            setDatos({
                ...datos,
                [name]: value,
            });
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!datos.fecha || !datos.id_paciente || !datos.peso || !datos.talla || !datos.indicaciones) {
            toast.error("Todos los campos son obligatorios");
            return;
        }

        if (detalleCitas.length === 0) {
            toast.error("Por favor, agrega un detalle de la cita");
            return;
        }

        setDatos((datos) => ({
            ...datos,
            detalleCitas: detalleCitas,
        }));

        setReadyToSubmit(true);

    }

    useEffect(() => {
        if (readyToSubmit) {
            const enviarDatos = async () => {
                try {
                    setLoading(true);
                    setLoading(true);

                    const response = await axios.post(`${dominio}/api/private/telemedicina/cita/register`, datos, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.status === 200) {
                        toast.success("Cita registrada correctamente");
                        setDatos({
                            fecha: "",
                            id_paciente: "",
                            peso: "",
                            talla: "",
                            id_medico: user.per_codigo,
                            indicaciones: "",
                            detalleCitas: []
                        })
                        setDetalleCitas([]);
                        setReadyToSubmit(false);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                    setReadyToSubmit(false);
                }
            };

            enviarDatos();
        }
    }, [readyToSubmit]);

    const handleChangeDetalle = (e) => {
        const { name, value } = e.target;
        setDatosDetalle({ ...datosDetalle, [name]: value });
    };

    const handleSubmitCitaDetalle = async (event) => {
        event.preventDefault();

        if (!datosDetalle.medicamento || !datosDetalle.horario) {
            toast.error("Todos los campos del detalle son obligatorios");
            return;
        }

        setDetalleCitas([...detalleCitas, datosDetalle]);

        setDatosDetalle({
            horario: "",
            medicamento: ""
        })
    }

    return (
        <div className={`container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div ref={sidebarRef}>
                <Sidebar isOpen={isSidebarOpen} />
            </div>
            <main className="main-content">
                <Header toggleSidebar={toggleSidebar} />
                <section className="stats">
                    <CitaForm
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        pacientes={pacientes}
                        handleChangeDetalle={handleChangeDetalle}
                        handleSubmitCitaDetalle={handleSubmitCitaDetalle}
                        detalleCitas={detalleCitas}
                        datosDetalle={datosDetalle}
                        setDetalleCitas={setDetalleCitas}
                        datos={datos}
                    />
                </section>
            </main>
            <ToastContainer closeButton={false} autoClose={4000} />
        </div>
    );
};

export default MisCitas;