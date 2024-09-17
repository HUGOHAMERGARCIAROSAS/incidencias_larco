import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';

import '../../assets/css/receta_medica.css';

const baseUrl = import.meta.env.BASE_URL;
const dominio = import.meta.env.VITE_API_URL;

import { useSelector } from 'react-redux';
import { selectAuth } from '../../redux/slices/authSlice';

const RecetaMedica = () => {

    const { id } = useParams();

    const { user, token } = useSelector(selectAuth);

    const [datosReceta, setDatosReceta] = useState({});

    const [medicamentos, setMedicamentos] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        const consultarCita = async () => {
            try {
                const response = await axios.get(`${dominio}/api/private/telemedicina/cita/getCita/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setDatosReceta(response.data.resultado[0]);
                setMedicamentos(response.data.medicamentos);

            } catch (error) {
                console.error(error);
            } finally {
            }
        };

        consultarCita();

    }, []);


    // const [datosReceta, setReceta] = useState({
    //     nombreMedico: "Dr. Juan Pérez",
    //     especialidad: "Cardiología",
    //     telefonoMedico: "987654321",
    //     nombrePaciente: "Pedro González",
    //     edadPaciente: 45,
    //     pesoPaciente: "70 kg",
    //     tallaPaciente: "1.75 m",
    //     fechaCita: "11/09/2024",
    //     indicaciones: "Descansar y tomar los medicamentos según las indicaciones.",
    //     medicamentos: [
    //         { nombre: "Paracetamol", horario: "Cada 8 horas" },
    //         { nombre: "Ibuprofeno", horario: "Cada 12 horas" },
    //     ]
    // });
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="receta-medica" id="receta">
            <div className="encabezado">
                <img src={`${baseUrl}images/login/mdvlh.png`} alt="Logo" className="logo" style={{ width: "200px" }} />
                <div className="datos-medico">
                    <p style={{ margin: "2px" }}><strong>Dr. {datosReceta.nombreMedico}</strong></p>
                    <p style={{ margin: "2px" }}> {datosReceta.especialidad}</p>
                    <p style={{ margin: "2px" }}>Teléfono: {datosReceta.telefonoMedico}</p>
                </div>
            </div>

            <hr style={{ marginTop: "40px", marginBottom: "40px" }} />

            <div className="datos-paciente">
                <p><strong>Nombre:</strong> {datosReceta.nombrePaciente}</p>
                <p><strong>Edad:</strong> {datosReceta.edadPaciente}</p>
                <p><strong>Peso:</strong> {datosReceta.pesoPaciente}</p>
                <p><strong>Talla:</strong> {datosReceta.tallaPaciente}</p>
                <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
            </div>

            <hr style={{ marginTop: "40px", marginBottom: "40px" }} />

            <div className="indicaciones">
                <h3>Indicaciones:</h3>
                <p>{datosReceta.indicaciones}</p>
                <ul>
                    {medicamentos.map((med, index) => (
                        <li key={index}>
                            {med.medicamento} - {med.horario}
                        </li>
                    ))}
                </ul>
            </div>

            <br style={{ marginBottom: "40px" }} />

            <div className="footer">
                <div className="fecha-footer">
                    <p><strong>Fecha:</strong> {datosReceta.fechaCita}</p>
                </div>
                <div className="firma">
                    <p style={{ margin: "2px" }}><strong>Dr. {datosReceta.nombreMedico}</strong></p>
                    <p style={{ margin: "2px" }}><strong>CMP: </strong> {datosReceta.cmp}</p>
                </div>
            </div>

            <button onClick={handlePrint} className="no-print">Imprimir receta</button>
            <button onClick={() => navigate(-1)} className="no-print" style={{ background: "red" }}>Volver</button>
        </div>
    );
};

export default RecetaMedica;
