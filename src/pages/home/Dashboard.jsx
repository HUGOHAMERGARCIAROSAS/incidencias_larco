
import '../../assets/css/layout.css';
import Sidebar from '../../pages/layout/Sidebar';
import Header from '../../pages/layout/Header';
import useSidebar from '../../hooks/useSidebar';
const baseUrl = import.meta.env.BASE_URL;

const Dashboard = () => {
  const { isSidebarOpen, toggleSidebar, sidebarRef } = useSidebar();

  return (
    <div className={`container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div ref={sidebarRef}>
        <Sidebar isOpen={isSidebarOpen} />
      </div>
      <main className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        <section className="stats">
          <img src={`${baseUrl}images/fondo.jpg`} className='fondo-dashboard' />
        </section>
      </main>
    </div>
  )
}

export default Dashboard
