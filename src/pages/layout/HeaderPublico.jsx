const baseUrl = import.meta.env.BASE_URL;
const HeaderPublico = () => {
    
    return (
        <header className="header">
            <button   className="sidebar-toggle">
                <img src={`${baseUrl}images/login/mdvlh.png`} alt="logo" className="logo-responsive"/>
                <span className='icon-sidebar'>☰</span>
            </button>
            <h2><span className='titulo-name' style={{ fontSize: 20, paddingTop: 10 }}>&nbsp; CALIFICACIÓN DEL SERVICIO</span></h2>
        </header>
    );
};

export default HeaderPublico;