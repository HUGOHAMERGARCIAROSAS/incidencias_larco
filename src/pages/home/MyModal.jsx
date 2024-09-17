import { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaRegSave, FaWindowClose } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from 'react-redux';
import { selectAuth } from '../../redux/slices/authSlice';
import '../../assets/css/modal.css';
import "react-toastify/dist/ReactToastify.css";

const dominio = import.meta.env.VITE_API_URL;
const MyModal = ({ isOpen, onClose }) => {



    const { user, token } = useSelector(selectAuth);
    const [documento, setDocumento] = useState('');
    const [persona, setPersona] = useState({
        dni: '',
        nombres: '',
        paterno: '',
        materno: '',
        fecha_nac: '',
        alergias: ''
    })

    const [encontrado, setEncontrado] = useState(false);

    const handleSubmitPaciente = async (event) => {
        event.preventDefault();
        if (!persona.dni || !persona.nombres || !persona.paterno || !persona.materno || !persona.fecha_nac) {
            toast.error("Todos los campos son obligatorios");
            return;
        }
        try {
            const response = await axios.post(`${dominio}/api/private/telemedicina/paciente/register`, persona, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                toast.success("Paciente registrado correctamente");
                event.target.reset();
                setPersona({
                    dni: '',
                    nombres: '',
                    paterno: '',
                    materno: '',
                    fecha_nac: '',
                    alergias: ''
                })

                window.location.reload();
            }

        } catch (error) {
            console.error(error);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPersona({ ...persona, [name]: value });
    };

    const handleSearchReniec = async (e) => {
        e.preventDefault();
        if (documento === "" || documento.length !== 8) return;

        const response = await axios.get(`${dominio}/api/private/pacientes/searchPaciente/${documento}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.data.longitud === 0) {
            setEncontrado(false);
        } else {
            setEncontrado(true);
            toast.error("El paciente ya se encuentra registrado");
            return;
        }

        try {
            axios.get(`https://sistema.munivictorlarco.gob.pe/tramiteonline/reniec?dni=${documento}`).then(response => {
                setPersona({
                    ...persona,
                    dni: documento,
                    nombres: response.data.data.consultarResponse.return.datosPersona.prenombres,
                    paterno: response.data.data.consultarResponse.return.datosPersona.apPrimer,
                    materno: response.data.data.consultarResponse.return.datosPersona.apSegundo
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeSearch = (e) => {
        setDocumento(e.target.value);
    };

    if (!isOpen) return null;
    return (
        <div className='modal-container'>
            <div className='modal-body'>
                <div>
                    <h2>REGISTRAR PACIENTE</h2>
                    <form onSubmit={handleSubmitPaciente} >
                        <div className="form-group">
                            <label htmlFor="documento">Documento: </label>
                            <input
                                id="documento"
                                type="text"
                                name="documento"
                                className="form-control"
                                placeholder="Ingrese el documento"
                                onChange={handleChangeSearch}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" onClick={handleSearchReniec} className="btn btn-primary" style={{ background: '#5cb85c', borderColor: '#5cb85c' }}><FaSearch size={15} /> Buscar </button>
                        </div>
                        <div className="form-group">
                            <label htmlFor="nombres">Nombres: </label>
                            <input
                                id="nombres"
                                type="text"
                                name="nombres"
                                className="form-control"
                                placeholder="Nombres"
                                value={persona.nombres}
                                readOnly
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="paterno">Apellido Paterno: </label>
                            <input
                                id="paterno"
                                type="text"
                                name="paterno"
                                className="form-control"
                                placeholder="Primer Apellido"
                                value={persona.paterno}
                                readOnly
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="materno">Apellido Materno: </label>
                            <input
                                id="materno"
                                type="text"
                                name="materno"
                                className="form-control"
                                placeholder="Segundo Apellido"
                                value={persona.materno}
                                readOnly
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                id="dni"
                                type="hidden"
                                name="dni"
                                className="form-control"
                                placeholder="DNI"
                                value={persona.dni}
                                readOnly
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fecha_nac">Fecha Nacimiento: </label>
                            <input
                                id="fecha_nac"
                                type="date"
                                name="fecha_nac"
                                className="form-control"
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="alergias">Alergias: </label>
                            <textarea
                                style={{ height: '100px', fontSize: '18px' }}
                                type="text"
                                id="alergias"
                                name="alergias"
                                placeholder="Ingresa alergias"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary"><FaRegSave size={15} /> Registrar</button>
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-primary" style={{ background: 'red', borderColor: 'red' }}
                                onClick={onClose}><FaWindowClose size={15} /> Cerrar Ventana</button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer closeButton={false} autoClose={2000} />
        </div>
    )
}

export default MyModal