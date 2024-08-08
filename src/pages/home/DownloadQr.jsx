// QRDownloadComponent.jsx

import { forwardRef } from 'react';
import QRCode from 'qrcode.react';
import '../../assets/css/QRDownload.css';

const QRDownloadComponent = forwardRef((props, ref) => (
    <div ref={ref} className="qr-container">
        <div className="header">
            Municipalidad Distrital de
            <br />
            Víctor Larco Herrera
        </div>
        <div className="qr-code">
            <QRCode value={props.qrSrc} size={200} />
        </div>
        <div className="footer">
            Enrique León Clement
            <br />
            Alcalde
            <br />
            #primeroLosVecinos
        </div>
    </div>
));

export default QRDownloadComponent;