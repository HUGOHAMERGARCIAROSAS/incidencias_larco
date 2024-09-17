import { FaSignOutAlt, FaTasks, FaDatabase, FaTh, FaBriefcaseMedical, FaHospitalUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useRef } from 'react';

const baseUrl = import.meta.env.BASE_URL;
const Sidebar = ({ isOpen }) => {
    const dispatch = useDispatch();
    const sidebarRef = useRef(null);

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`} ref={sidebarRef}>
            <h2><img src={`${baseUrl}images/login/mdvlh.png`} alt="logo" className="logo-normal"></img></h2>
            <h2><img src={`${baseUrl}images/login/mdvlh.png`} alt="logo" className="logo-responsive"></img></h2>
            <ul>
                <li>
                    <Link to="/dashboard"><FaTh className="icons-length" /> Dashboard</Link>
                </li>
                <li>
                    <Link to="/mis-datos"><FaDatabase className="icons-length" /> Mis Datos</Link>
                </li>
                <li>
                    <Link to="/mis-pacientes"><FaHospitalUser className="icons-length" /> Mis Pacientes</Link>
                </li>
                <li>
                    <Link to="/mi-cita"><FaBriefcaseMedical className="icons-length" /> Registrar Cita </Link>
                </li>
                <li>
                    <Link to="/citas_todas"><FaTasks className="icons-length" />Ver Citas</Link>
                </li>
                <li><a onClick={() => dispatch(logout())}><FaSignOutAlt className="icons-length" /> Cerrar Sesión</a></li>
            </ul>
        </aside>
    );
};

export default Sidebar;