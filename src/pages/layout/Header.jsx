
import { useSelector } from 'react-redux';
import { selectAuth } from '../../redux/slices/authSlice';
const baseUrl = import.meta.env.BASE_URL;

const Header = ({ toggleSidebar }) => {

    const { user } = useSelector(selectAuth);

    return (
        <header className="header">
            <button onClick={toggleSidebar} className="sidebar-toggle">
                <img src={`${baseUrl}images/login/mdvlh.png`} alt="logo" className="logo-responsive"></img>
                <span className='icon-sidebar'>☰</span>
            </button>
            <h2>Bienvenido, <span className='titulo-name'>{user?.nombres}!</span></h2>
        </header>
    );
};

export default Header;