import { useEffect, useState, useRef } from 'react';
import '../../assets/css/layout.css';
import Sidebar from '../../pages/layout/Sidebar';
import Header from '../../pages/layout/Header';
import '../../assets/css/forms.css';
import html2canvas from 'html2canvas';
import QRDownloadComponent from './DownloadQr';
import { FaDownload } from "react-icons/fa";

import { useSelector } from 'react-redux';
import { selectAuth } from '../../redux/slices/authSlice';
import useSidebar from '../../hooks/useSidebar';

const dominio = import.meta.env.VITE_API_URL;
const MyQr = () => {
    const { isSidebarOpen, toggleSidebar, sidebarRef } = useSidebar();
    const { user } = useSelector(selectAuth);
    const [data, setData] = useState('');

    useEffect(() => {
        const initialData = `http://localhost:5173/verQr/${user?.per_codigo}`;
        setData(initialData);
    }, []);

    const qrRef = useRef(null);

    const handleDownload = () => {
        html2canvas(qrRef.current, { useCORS: true }).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'qr_image.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    };

    return (
        <div className={`container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <div ref={sidebarRef}>
                <Sidebar isOpen={isSidebarOpen} />
            </div>
            <main className="main-content">
                <Header toggleSidebar={toggleSidebar} />
                <section className="stats" style={{ marginTop: '0' }}>
                    <div className="form-container">
                        <div>
                            <h1 style={{ textAlign: 'center' }}>Código QR</h1>
                            <button onClick={handleDownload}><FaDownload /> Descargar</button>
                        </div>
                    </div>

                </section>
                <section>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                        <QRDownloadComponent ref={qrRef} qrSrc={data} />
                    </div>
                </section>
            </main>
        </div>
    )
}

export default MyQr