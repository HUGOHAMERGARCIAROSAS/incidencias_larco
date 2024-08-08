import axios from 'axios';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";

import Sidebar from '../../pages/layout/Sidebar';
import Header from '../../pages/layout/Header';

import '../../assets/css/layout.css';
import '../../assets/css/forms.css';
import "react-toastify/dist/ReactToastify.css";

import { useSelector } from 'react-redux';
import { selectAuth } from '../../redux/slices/authSlice';

import useSidebar from '../../hooks/useSidebar';
import useFetchData from '../../hooks/useFetchData';

import TaxiForm from './TaxiForm';

const dominio = import.meta.env.VITE_API_URL;

const MisAutos = () => {
    const { user, token } = useSelector(selectAuth);
    const { isSidebarOpen, toggleSidebar, sidebarRef } = useSidebar();
    const { data: empresas, loading: loadingEmpresas } = useFetchData(`${dominio}/api/private/auto/getempresas`, token);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("¡Después de registrar un nuevo taxi, verifique bien sus datos porque solo tendrá 30 minutos para actualizarlo!");
    const [datos, setDatos] = useState({
        color: "",
        modelo: "",
        placa: "",
        idempresa: "",
        per_codigo: user?.per_codigo
    });

    const handleChangeTaxi = (e) => {
        const { name, value } = e.target;
        setDatos({
            ...datos,
            [name]: value
        });
    };

    const handleSubmitTaxi = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!datos.color || !datos.modelo || !datos.placa || !datos.idempresa) {
            toast.error("Todos los campos son obligatorios");
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post(`${dominio}/api/private/auto/register`, datos, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setLoading(false);
            if (response.data.result.recordset[0].estado === 1) {
                toast.success(response.data.result.recordset[0].texto);
                setMessage("");
                fetchData();
            } else {
                setMessage(response.data.result.recordset[0].texto);
                fetchData();
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.post(`${dominio}/api/private/auto/get`, datos, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.resultado.length === 0) {
                setDatos({
                    ...datos
                });
                setLoading(false);
                return;
            }
            const { color, modelo, placa, idempresa } = response.data.resultado[0];
            setDatos({
                ...datos,
                color,
                modelo,
                placa,
                idempresa
            });
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
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
                    <TaxiForm
                        datos={datos}
                        handleChange={handleChangeTaxi}
                        handleSubmit={handleSubmitTaxi}
                        loading={loading}
                        empresas={empresas}
                        message={message}
                    />
                </section>
            </main>
            <ToastContainer closeButton={false} autoClose={4000} />
        </div>
    );
};

export default MisAutos;