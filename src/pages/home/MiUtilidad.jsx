import { useEffect, useState } from 'react';
import '../../assets/css/layout.css';
import Sidebar from '../../pages/layout/Sidebar';
import Header from '../../pages/layout/Header';
import '../../assets/css/forms.css';
import { FaRegSave } from "react-icons/fa";

import { useSelector } from 'react-redux';
import { selectAuth } from '../../redux/slices/authSlice';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';
import useSidebar from '../../hooks/useSidebar';
const dominio = import.meta.env.VITE_API_URL;
const MiUtilidad = () => {

    const { user, token } = useSelector(selectAuth);
    const { isSidebarOpen, toggleSidebar, sidebarRef } = useSidebar();
    const [datosIngreso, setDatosIngreso] = useState({
        monto_ingreso: 0,
        destino: ""
    });
    const [datosGasto, setDatosGasto] = useState({
        monto_gasto: 0,
        gasto: ""
    });

    const [utilidades, setUtilidades] = useState("");

    const handleChangeIngreso = (e) => {
        const { name, value } = e.target;

        if (name === 'monto_ingreso') {
            if (/^\d*\.?\d*$/.test(value)) {
                setDatosIngreso((datosIngreso) => ({
                    ...datosIngreso,
                    [name]: value,
                    tipo: 1,
                    per_codigo: user?.per_codigo
                }));
            }
        } else {
            setDatosIngreso((datosIngreso) => ({
                ...datosIngreso,
                [name]: value,
                tipo: 1,
                per_codigo: user?.per_codigo
            }));
        }
    };

    const handleChangeGastos = (e) => {
        const { name, value } = e.target;
        if (name === 'monto_gasto') {
            if (/^\d*\.?\d*$/.test(value)) {
                setDatosGasto((datosGasto) => ({
                    ...datosGasto,
                    [name]: value,
                    tipo: 2,
                    per_codigo: user?.per_codigo
                }));
            }
        } else {
            setDatosGasto((datosGasto) => ({
                ...datosGasto,
                [name]: value,
                tipo: 2,
                per_codigo: user?.per_codigo
            }));
        }
    };

    const handleSubmitIngreso = (e) => {
        e.preventDefault();
        if (datosIngreso.monto_ingreso < 0) {
            toast.error("El monto no puede ser negativo", { closeButton: false, autoClose: 2000 });
            return;
        }
        if (datosIngreso.destino === "") {
            toast.error("El destino no puede estar vacío", { closeButton: false, autoClose: 2000 });
            return;
        }

        try {
            axios.post(`${dominio}/api/private/utilidad/register`, datosIngreso, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    toast.success("Ingreso registrado exitosamente", { autoClose: 2000, closeButton: false });
                    setDatosIngreso({
                        monto_ingreso: 0,
                        destino: ""
                    });
                    fetchDataActualiza();
                })
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmitGasto = (e) => {
        e.preventDefault();
        if (datosGasto.monto_gasto < 0) {
            toast.error("El monto no puede ser negativo");
            return;
        }
        if (datosGasto.destino === "") {
            toast.error("El gasto no puede estar vacío.");
            return;
        }

        try {
            axios.post(`${dominio}/api/private/utilidad/register`, datosGasto, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    toast.success("Gasto registrado exitosamente", { autoClose: 2000, closeButton: false });
                    setDatosGasto({
                        monto_gasto: 0,
                        gasto: ""
                    });
                    fetchDataActualiza();
                })
        } catch (error) {
            console.log(error);
        }
    }

    const fetchDataActualiza = async () => {
        try {

            await axios.get(`${dominio}/api/private/user/utilidad/${user?.per_codigo}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                setUtilidades(response.data.resultado[0].utilidad);
            });

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        const fetchData = async () => {
            try {

                await axios.get(`${dominio}/api/private/user/utilidad/${user?.per_codigo}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(response => {
                    setUtilidades(response.data.resultado[0].utilidad);
                });

            } catch (error) {
                console.log(error);
            }
        }

        fetchData();

    }, []);

    const handleValidationNumber = (e) => {
        const { name, value } = e.target;
    }


    return (
        <div className={`container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div ref={sidebarRef}>
                <Sidebar isOpen={isSidebarOpen} />
            </div>
            <main className="main-content">
                <Header toggleSidebar={toggleSidebar} />
                <section className="stats" style={{ marginTop: '0' }}>
                    <div className="form-container">
                        <h2>MI UTILIDAD: S/ {utilidades}</h2>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#b22222' }}>Última actualización: {new Date().toLocaleString()}</span>
                    </div>
                    <div className="form-container">
                        <h2>Registro Ingreso Monetario</h2>
                        <form onSubmit={handleSubmitIngreso}>
                            <div className="form-group">
                                <label htmlFor="destino">Destino</label>
                                <input type="text" id="destino" name="destino" placeholder="Ingresa tu destino" value={datosIngreso.destino || ""} onChange={handleChangeIngreso} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="monto_ingreso">Monto</label>
                                <input type="texto" id="monto_ingreso"
                                    name="monto_ingreso" placeholder="Ingresa tu monto"
                                    value={datosIngreso.monto_ingreso || ""} onChange={handleChangeIngreso}
                                    onKeyUp={handleValidationNumber}
                                    required />
                            </div>
                            <button type="submit" className='search-location'><FaRegSave className='icons-length' size={15} /> Guardar Ingreso </button>
                        </form>
                    </div>
                    <div className="form-container">
                        <h2>Registro Gasto Monetario</h2>
                        <form onSubmit={handleSubmitGasto}>
                            <div className="form-group">
                                <label htmlFor="gasto">Gasto Concepto</label>
                                <input type="text" id="gasto" name="gasto" placeholder="Ingresa tu gasto" value={datosGasto.gasto || ""} onChange={handleChangeGastos} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="monto_gasto">Monto</label>
                                <input type="texto" id="monto_gasto" name="monto_gasto" placeholder="Ingresa tu monto" value={datosGasto.monto_gasto || ""} onChange={handleChangeGastos} required />
                            </div>
                            <button type="submit" className='search-red'><FaRegSave className='icons-length' size={15} /> Guardar Gasto </button>
                        </form>
                    </div>
                </section>
            </main>
            <ToastContainer closeButton={false} autoClose={2000} />
        </div>
    )
}

export default MiUtilidad