import { useEffect, useState, Fragment } from 'react';
import { FaRegSave } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';

import HeaderPublico from '../pages/layout/HeaderPublico';

import "react-toastify/dist/ReactToastify.css";
import '../assets/css/layout.css';
import '../assets/css/forms.css';


const dominio = import.meta.env.VITE_API_URL;
const MisDatos = () => {

    const { id } = useParams();

    const [datos, setDatos] = useState({
        color: "",
        modelo: "",
        placa: "",
        idempresa: "",
        per_codigo: id,
        paterno: "",
        materno: "",
        nombres: "",
        empresa: ""
    });
    const [rating, setRating] = useState(0);
    const [documento, setDocumento] = useState("");
    const navigate = useNavigate();
    const handleRatingChange = (event) => {
        setRating(parseInt(event.target.value));
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get(`${dominio}/api/public/searchUserByCodigo/${id}`).then(response => {
                    if (response.data?.person === undefined) {
                        setDatos({
                            ...datos
                        })
                        toast.error("El usuario no existe");
                        return
                    }
                    const { per_codigo, paterno, materno, nombres, empresa, modelo, placa, color } = response.data.person;
                    setDatos({
                        ...datos,
                        per_codigo,
                        paterno,
                        materno,
                        nombres,
                        empresa,
                        modelo,
                        placa,
                        color
                    })
                });

            } catch (error) {
                console.log(error);
            }
        }


        fetchData();
    }, []);

    const handleChangeDocumento = (e) => {
        const { name, value } = e.target;

        if (name === 'documento') {
            if (/^\d*\.?\d*$/.test(value)) {
                setDocumento(value);
            }
        } else {
            setDocumento(...documento);
        }

    };


    const handleCalificar = async (event) => {
        event.preventDefault();

        if (rating === 0) {
            toast.error("Debes calificar el servicio");
            return;
        }

        if (documento.length !== 8) {
            toast.error("Debes registrar un documento válido");
            return;
        }

        try {
            const response = await axios.post(`${dominio}/api/public/rating/registerRating`, {
                ...datos,
                numero: rating,
                per_codigo: id,
                documento
            });
            toast.success("Calificado exitosamente");
            navigate(`/exito/${rating}`, { replace: true });
            setRating(0);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="container sidebar-closed">
            <main className="main-content">
                <HeaderPublico />
                <section className="stats">
                    <div className="form-container">
                        <h2>INFORMACIÓN DE USUARIO</h2>
                        <div className="form-group">
                            <label htmlFor="name">Nombres: <span className="calificar-valor">{datos?.nombres || ""}</span></label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="paterno">Paterno: <span className="calificar-valor">{datos?.paterno || ""}</span></label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="materno">Materno: <span className="calificar-valor">{datos?.materno || ""}</span></label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="empresa">Empresa: <span className="calificar-valor">{datos?.empresa || ""}</span></label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="placa">Placa: <span className="calificar-valor">{datos?.placa || ""}</span></label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="modelo">Modelo: <span className="calificar-valor">{datos?.modelo || ""}</span></label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="color">Color: <span className="calificar-valor">{datos?.color || ""}</span></label>
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="documento">DNI: </label>
                            <input type="text" id="documento" name="documento" placeholder="Ingresa tu documento" onChange={handleChangeDocumento} required value={documento} pattern="[0-9]{8}" maxLength={8} />
                        </div>
                        <div className="rating">
                            {[...Array(5)].map((_, index) => {
                                const value = 5 - index;
                                return (
                                    <Fragment key={index}>
                                        <input
                                            type="radio"
                                            id={`star${value}`}
                                            name="rating"
                                            value={value}
                                            onChange={handleRatingChange}
                                            checked={rating === value}
                                            required
                                        />
                                        <label htmlFor={`star${value}`}>&#9733;</label>
                                    </Fragment>
                                );
                            })}
                        </div>
                        <br />
                        <form onSubmit={handleCalificar}>
                            <button type="submit"><FaRegSave className='icons-length' size={15} /> Calificar</button>
                        </form>
                    </div>
                </section>
            </main>
            <ToastContainer closeButton={false} autoClose={2000} />
        </div>
    )
}

export default MisDatos