import { FaSignOutAlt, FaTasks, FaDatabase, FaTh, FaCar } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { useRef } from 'react';
const Sidebar = ({ isOpen }) => {
    const dispatch = useDispatch();
    const sidebarRef = useRef(null);

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`} ref={sidebarRef}>
            <h2><img src="/images/login/mdvlh.png" alt="logo" className="logo-normal"></img></h2>
            <h2><img src="/images/login/mdvlh.png" alt="logo" className="logo-responsive"></img></h2>
            <ul>
                <li>
                    <Link to="/dashboard"><FaTh className="icons-length" /> Dashboard</Link>
                </li>
                <li>
                    <Link to="/mis-autos"><FaCar className="icons-length" /> Mi Taxi</Link>
                </li>
                <li>
                    <Link to="/mis-datos"><FaDatabase className="icons-length" /> Mis Datos</Link>
                </li>
                <li>
                    <Link to="/mis-incidencias"><FaTasks className="icons-length" />Incidencias</Link>
                </li>
                <li>
                    <Link to="/todas-las-incidencias"><FaTasks className="icons-length" />Mapa Incidencias</Link>
                </li>
                <li>
                    <Link to="/mi_utilidad"><FaTasks className="icons-length" />Mi Utilidad</Link>
                </li>
                <li>
                    <Link to="/miqr"><FaTasks className="icons-length" /> Mi QR</Link>
                </li>
                <li><a onClick={() => dispatch(logout())}><FaSignOutAlt className="icons-length" /> Cerrar Sesión</a></li>
            </ul>
        </aside>
    );
};

export default Sidebar;