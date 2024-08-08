import axios from 'axios';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaRegSave, FaSearch } from "react-icons/fa";

import { selectAuth } from '../../redux/slices/authSlice';
import Sidebar from '../../pages/layout/Sidebar';
import Header from '../../pages/layout/Header';
import useSidebar from '../../hooks/useSidebar';

import "react-toastify/dist/ReactToastify.css";
import '../../assets/css/layout.css';
import '../../assets/css/forms.css';

const dominio = import.meta.env.VITE_API_URL;

const IncidenciaCreate = () => {

    const { user, token } = useSelector(selectAuth);
    const { isSidebarOpen, toggleSidebar, sidebarRef } = useSidebar();
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [tipoIncidencia, setTipoIncidencia] = useState([]);

    const [incidencia, setIncidencia] = useState({
        per_codigo: user?.per_codigo,
        latitud: location.latitude,
        longitud: location.longitude,
        tipo_incidencia: "",
    })
    const [tieneTaxi, setTieneTaxi] = useState(false);



    const handleDatos = (event) => {
        const { name, value } = event.target;
        setIncidencia({
            ...incidencia,
            [name]: value
        });
    };

    const handleSearchUbicacion = (event) => {
        event.preventDefault();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setIncidencia({
                        ...incidencia,
                        latitud: position.coords.latitude,
                        longitud: position.coords.longitude
                    })
                },
                (error) => {
                    console.error('Error obtaining geolocation', error);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }

    };

    useEffect(() => {

        const fetchDataEmpresa = async () => {
            try {
                await axios.get(`${dominio}/api/private/empresas/getEmpresaByID/${user.per_codigo}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => {
                    const resp = response.data.resultado[0];
                    resp === 0 ? setTieneTaxi(false) : setTieneTaxi(true)
                });

            } catch (error) {
                console.log(error);
            }
        }

        const fetchData = async () => {
            try {
                await axios.get(`${dominio}/api/private/tipo_incidencias/getall`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => {
                    setTipoIncidencia(response.data.resultado)
                });

            } catch (error) {
                console.log(error);
            }
        }

        fetchDataEmpresa();
        fetchData();

    }, []);


    const TieneTaxi = () => {
        return (
            <div className="form-group">
                <p htmlFor="tiene_taxi" className="form-label" style={{ color: 'red', fontSize: '18px' }}>Para registrar una incedencia tiene que llenar la información de su taxi.</p>
                <p style={{ textAlign: 'center' }}><Link to="/mis-autos" >REGISTRAR AQUÍ.</Link></p>
            </div>
        );
    }

    const handleSubmitIncidencia = async (event) => {
        event.preventDefault();
        if (!incidencia.latitud || !incidencia.longitud || !incidencia.tipo_incidencia) {
            toast.error("Todos los campos son obligatorios");
            return;
        }

        try {
            await axios.post(`${dominio}/api/private/tipo_incidencias/register`, incidencia, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                toast.success("Incidencia registrada exitosamente");
                setIncidencia({
                    ...incidencia,
                    latitud: "",
                    longitud: "",
                    tipo_incidencia: ""
                });
                setLocation({ latitude: null, longitude: null });
            });

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={`container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div ref={sidebarRef}>
                <Sidebar isOpen={isSidebarOpen} />
            </div>
            <main className="main-content">
                <Header toggleSidebar={toggleSidebar} />
                <section className="stats">
                    <div className="form-container">
                        <h2>REGISTRAR INCIDENCIA</h2>
                        <form onSubmit={handleSubmitIncidencia} >
                            <div className="form-group">
                                <button className="search-location" onClick={handleSearchUbicacion}><FaSearch className="icons-length" /> Buscar Localización</button>
                            </div>
                            <div className="form-group">
                                <label htmlFor="latitud">Latitud</label>
                                <input type="text" id="latitud" name="latitud" placeholder="Latitud" value={location.latitude || ""} onChange={handleDatos} required readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="longitud">Longitud</label>
                                <input type="text" id="longitud" name="longitud" placeholder="Longitud" value={location.longitude || ""} onChange={handleDatos} required readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tipo_incidencia">Tipo Incidencia</label>
                                <select id="tipo_incidencia" name="tipo_incidencia" required onChange={handleDatos} value={incidencia?.tipo_incidencia} >
                                    <option value="">Seleccione una opción</option>
                                    {tipoIncidencia.map((item, index) => (
                                        <option key={index} value={item.idtipo}>{item.descripcion}</option>
                                    ))}
                                </select>
                            </div>
                            {
                                tieneTaxi === false ? <TieneTaxi /> : <button type="submit"><FaRegSave className='icons-length' size={15} /> Registrar</button>
                            }
                        </form>
                    </div>
                </section>
            </main>
            <ToastContainer closeButton={false} autoClose={2000} />
        </div>
    )
}

export default IncidenciaCreate