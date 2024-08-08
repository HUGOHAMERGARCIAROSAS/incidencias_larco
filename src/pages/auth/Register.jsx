import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, selectAuth } from "../../redux/slices/authSlice";

import { FaRegPlusSquare, FaSignInAlt, FaRegUser, FaAddressCard, FaLock } from "react-icons/fa";

import "../../assets/css/login.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const dominio = import.meta.env.VITE_API_URL;

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [documento, setDocumento] = useState("");
    const [loading, setLoading] = useState(false);

    const [persona, setPersona] = useState({
        documento: "",
        nombres: "",
        paterno: "",
        materno: "",
        password: "",
        password_confirmation: ""
    });

    const [info, setInfo] = useState({
        persona: {},
        user: false
    });

    const [userCreate, setUserCreate] = useState({
        per_login: "",
        password: "",
        password_confirmation: 2,
        per_codigo: ""
    });

    const handleChangeSearch = (e) => {
        setDocumento(e.target.value);
    };

    const handleChangeCreateUser = (e) => {

        setUserCreate({
            ...userCreate,
            per_login: info.persona.documento,
            per_codigo: info.persona.persona_ID,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {

            if (documento === "" || documento.length !== 8) return;

            setLoading(true);

            try {
                axios.get(`${dominio}/api/public/searchUser/${documento}`).then(response => {
                    setInfo({
                        ...info,
                        persona: response.data.person,
                        user: response.data.user
                    });
                });
            } catch (error) {
                console.log(error);
            }
        }
    };

    const comparePasswords = () => {
        if (userCreate.password !== userCreate.password_confirmation) {
            return false;
        }
        return true;
    };

    const handleCreateUserSubmit = (e) => {
        e.preventDefault();
        if (!comparePasswords()) {
            toast.error("Las contraseñas no coinciden");
            return;
        }
        try {
            axios.post(`${dominio}/api/public/user/register`, userCreate).then(response => {
                dispatch(loginUser({ per_login: userCreate.per_login, password: userCreate.password }));
                navigate("/dashboard", { replace: true });
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearchReniec = (e) => {
        e.preventDefault();
        if (documento === "" || documento.length !== 8) return;

        try {
            axios.get(`https://sistema.munivictorlarco.gob.pe/tramiteonline/reniec?dni=${documento}`).then(response => {
                setPersona({
                    ...persona,
                    documento: documento,
                    nombres: response.data.data.consultarResponse.return.datosPersona.prenombres,
                    paterno: response.data.data.consultarResponse.return.datosPersona.apPrimer,
                    materno: response.data.data.consultarResponse.return.datosPersona.apSegundo
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeCreatePersona = (e) => {
        setPersona({
            ...persona,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitCreatePersona = (e) => {
        e.preventDefault();

        if (persona.password !== persona.password_confirmation) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        try {
            axios.post(`${dominio}/api/public/user/registerPerson`, persona).then(response => {
                if (response.data.error) return toast.error(response.data.error);
                dispatch(loginUser({ per_login: persona.documento, password: persona.password }));
                navigate("/dashboard", { replace: true });
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="login-container">

            <div className="login-image">
                <div className="overlay">
                    <h2>Sistema de Incidencias de Victor Larco Herrera</h2>
                    <p className="login-description">
                        Es el servicio que ofrece la municipalidad distrital de Victor Larco Herrera que permite registrar y gestionar las incidencias como violencia,
                        vandalismo, robo, radicalismo, personas sordas, agresion sexual, acoso, entre otros.
                    </p>
                </div>
            </div>
            <div className="login-form">
                <div className="form-content">
                    <a onClick={() => navigate("/login")}><img src="/images/login/mdvlh.png" /></a>
                    <h1>REGISTRARSE</h1>
                    <div className="input-container">
                        <div className="input_logo_container">
                            <FaAddressCard size={30} style={{ marginRight: "5px", marginLeft: "5px" }} />
                            <input
                                type="text"
                                placeholder="Digite su DNI"
                                className="input"
                                name="documento"
                                maxLength={8}
                                onChange={handleChangeSearch}
                                onKeyDown={handleSearch}
                                required
                            />
                            <button type="button" className="input-search" onClick={handleSearch} > Buscar</button>
                        </div>
                    </div>

                    {info.persona && info.user && loading && (
                        <div className="input-container">
                            <p><strong>Nombres: </strong>{info.persona.nombres}</p>
                            <p><strong>Usuario: </strong>Usted ya tiene usuario, comuniquese con el administrador para solicitar sus accesos en caso no los posea.</p>
                        </div>
                    )}

                    {
                        info.persona.nombres && !info.user && loading && (
                            <div className="input-container">
                                <div className="input_logo_container">
                                    <p><strong>Nombres: </strong>{info.persona.nombres}</p>
                                </div>
                                <form onSubmit={handleCreateUserSubmit}>
                                    <div className="input-container">
                                        <div className="input_logo_container">
                                            <FaRegUser size={20} style={{ marginRight: "5px", marginLeft: "5px" }} />
                                            <input type="text" placeholder="Usuario" className="input" name="per_login" onChange={handleChangeCreateUser} value={info.persona.documento} readOnly required />
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <div className="input_logo_container">
                                            <FaLock size={20} style={{ marginRight: "5px", marginLeft: "5px" }} />
                                            <input type="password" placeholder="Contraseña" className="input" name="password" onChange={handleChangeCreateUser} required />
                                        </div>
                                    </div>
                                    <div className="input-container">
                                        <div className="input_logo_container">
                                            <FaLock size={20} style={{ marginRight: "5px", marginLeft: "5px" }} />
                                            <input type="password" placeholder="Confirmar contraseña" className="input"
                                                onKeyDown={comparePasswords}
                                                name="password_confirmation" onChange={handleChangeCreateUser} required />
                                        </div>
                                    </div>
                                    <button type="submit" className="register-button">
                                        <FaRegPlusSquare size={15} style={{ marginRight: "5px", marginLeft: "5px" }} /> Registrarse
                                    </button>
                                </form>
                            </div>
                        )
                    }

                    {
                        !info.persona.nombres && loading && (
                            <div className="input-container">
                                <div className="input_logo_container">
                                    <p><strong>NO EXISTE </strong>Consultar en RENIEC</p>
                                </div>
                                <button type="button" className="login-register-button" onClick={handleSearchReniec} > Buscar Nombres</button>
                                <hr />
                                <form onSubmit={handleSubmitCreatePersona}>
                                    <div className="input-container ">
                                        <div className="input_logo_container">
                                            <FaRegUser size={20} style={{ marginRight: "5px", marginLeft: "5px" }} />
                                            <input type="text" placeholder="Paterno" className="input" name="paterno" onChange={handleChangeCreatePersona} value={persona.paterno} readOnly required />
                                        </div>
                                    </div>
                                    <div className="input-container ">
                                        <div className="input_logo_container">
                                            <FaRegUser size={20} style={{ marginRight: "5px", marginLeft: "5px" }} />
                                            <input type="text" placeholder="Materno" className="input" name="materno" onChange={handleChangeCreatePersona} value={persona.materno} readOnly required />
                                        </div>
                                    </div>
                                    <div className="input-container ">
                                        <div className="input_logo_container">
                                            <FaRegUser size={20} style={{ marginRight: "5px", marginLeft: "5px" }} />
                                            <input type="text" placeholder="Nombres" className="input" name="nombres" onChange={handleChangeCreatePersona} value={persona.nombres} readOnly required />
                                        </div>
                                    </div>
                                    <div className="input-container ">
                                        <div className="input_logo_container">
                                            <FaLock size={20} style={{ marginRight: "5px", marginLeft: "5px" }} />
                                            <input type="password" placeholder="Contraseña" className="input" name="password" onChange={handleChangeCreatePersona} required />
                                        </div>
                                    </div>
                                    <div className="input-container ">
                                        <div className="input_logo_container">
                                            <FaLock size={20} style={{ marginRight: "5px", marginLeft: "5px" }} />
                                            <input type="password" placeholder="Confirmar Contraseña" className="input" name="password_confirmation" onChange={handleChangeCreatePersona} required />
                                        </div>
                                    </div>
                                    <button type="submit" className="register-button">
                                        <FaRegPlusSquare size={15} style={{ marginRight: "5px", marginLeft: "5px" }} /> Registrarse
                                    </button>
                                </form>
                            </div>

                        )
                    }
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;
