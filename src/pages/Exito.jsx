
import { useParams } from 'react-router-dom';

import HeaderPublico from '../pages/layout/HeaderPublico';
import Confetti from 'react-confetti';
import "react-toastify/dist/ReactToastify.css";
import '../assets/css/layout.css';
import '../assets/css/forms.css';


const dominio = import.meta.env.VITE_API_URL;
const Exito = () => {

    const { rating } = useParams();


    return (
        <div className="container sidebar-closed">
            <main className="main-content">
                <HeaderPublico />
                <Confetti />
                <section className="stats">
                    <div className="form-container">
                        <h2>Calificado Exitosamente con {rating} estrellas!!</h2>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Exito