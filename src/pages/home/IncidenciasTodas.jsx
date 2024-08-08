import { useEffect, useState } from 'react';
import axios from 'axios';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useSelector } from 'react-redux';

import Sidebar from '../../pages/layout/Sidebar';
import Header from '../../pages/layout/Header';
import { selectAuth } from '../../redux/slices/authSlice';
import { FaRedoAlt } from "react-icons/fa";
import useSidebar from '../../hooks/useSidebar';

import '../../assets/css/layout.css';
import '../../assets/css/forms.css';

const dominio = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const MAP_ID = import.meta.env.VITE_MAP_KEY;

const coordenadas = { lat: -8.139256, lng: -79.051382 };

const IncidenciasTodas = () => {
  const { user, token } = useSelector(selectAuth);
  const { isSidebarOpen, toggleSidebar, sidebarRef } = useSidebar();
  const [loading, setLoading] = useState(false);
  const [incidencias, setIncidencias] = useState([]);
  const [showDirections, setShowDirections] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${dominio}/api/private/incidencias/IncidenciasEmpresa/${user.per_codigo}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setIncidencias(response.data.resultado);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

    // Obtener la posición actual del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log(error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleMarkerClick = (marker) => {
    // Limpiar la ruta antes de seleccionar un nuevo marcador
    setShowDirections(false);
    setSelectedMarker(marker);
    setShowDirections(true);  // Esto activa la ruta con el nuevo marcador
  };

  const handleMapClick = () => {
    setSelectedMarker(null); // Cerrar InfoWindow cuando se hace clic en el mapa
  };

  const handleClickUpdate = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.get(`${dominio}/api/private/incidencias/IncidenciasEmpresa/${user.per_codigo}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setIncidencias(response.data.resultado);
      setShowDirections(false);
      setShowDirections(true);
    } catch (error) {
      console.log(error);
    }
    
    setLoading(false);
  };


  // const handleGoToLocation = (event) => {
  //   event.preventDefault();
  
  //   if (userPosition && selectedMarker) {
  //     setShowDirections(true);  // Esto activa la ruta y mantiene el modal abierto
  //   } else {
  //     console.error("No se pudo obtener la ubicación del usuario o no se seleccionó un marcador.");
  //   }
  // };
  
  const handleRouteDrawn = () => {
    setSelectedMarker(null);  // Cierra el modal después de dibujar la ruta
  };

  

  return (
    <div className={`container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div ref={sidebarRef}>
        <Sidebar isOpen={isSidebarOpen} />
      </div>
      <main className="main-content">
        <Header toggleSidebar={toggleSidebar} />
        <section className="stats" style={{ paddingTop: '0', gap: '10px' }}>
          {
            loading ? null : <button className="btn-secondary" onClick={handleClickUpdate}><FaRedoAlt className="icons-length" /> Actualizar Mapa</button>
          }
  
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#b22222' }}>Última actualización: {new Date().toLocaleString()}</span>
          <APIProvider apiKey={API_KEY}>
            <Map
              className='map-container'
              mapContainerStyle={{ height: '100vh', width: '100%' }}
              center={coordenadas}
              zoom={15}
              mapId={MAP_ID}
              onClick={handleMapClick} // Maneja el clic en el mapa
            >
              {incidencias.map((marker, index) => (
                <AdvancedMarker
                  key={index}
                  position={{ lat: parseFloat(marker.latitud), lng: parseFloat(marker.longitud) }}
                  title={marker.nombres || 'Sin título'}
                  onClick={() => handleMarkerClick(marker)}
                />
              ))}
  
              {selectedMarker && (
                <div className="info-window" style={{
                  position: 'absolute',
                  width: '70%',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'white',
                  padding: '10px',
                  borderRadius: '4px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  zIndex: 1
                }}>
                  <h4 style={{ textAlign: 'center' }}>{selectedMarker.incidencia || 'Sin título'}</h4>
                  <hr />
                  <h4 style={{ fontSize: '16px', margin: '5px', fontWeight: 400 }}>• Chofer: <span style={{ fontWeight: 'bold' }}> {selectedMarker.nombres || 'Sin descripción'} </span></h4>
                  <h4 style={{ fontSize: '16px', margin: '5px', fontWeight: 400 }}>• Empresa: <span style={{ fontWeight: 'bold' }}>{selectedMarker.empresa || 'Sin descripción'}</span></h4>
                  <h4 style={{ fontSize: '16px', margin: '5px', fontWeight: 400 }}>• Placa: <span style={{ fontWeight: 'bold' }}>{selectedMarker.placa || 'Sin descripción'}</span></h4>
                  <h4 style={{ fontSize: '16px', margin: '5px', fontWeight: 400 }}>• Modelo: <span style={{ fontWeight: 'bold' }}>{selectedMarker.modelo || 'Sin descripción'}</span></h4>
                  <h4 style={{ fontSize: '16px', margin: '5px', fontWeight: 400 }}>• Color: <span style={{ fontWeight: 'bold' }}>{selectedMarker.color || 'Sin descripción'}</span></h4>
                  <h4 style={{ fontSize: '16px', margin: '5px', fontWeight: 400 }}>• Fecha: <span style={{ fontWeight: 'bold' }}>{selectedMarker.fecha || 'Sin descripción'}</span></h4>
                  <h4 style={{ fontSize: '16px', margin: '5px', fontWeight: 400 }}>• Hora: <span style={{ fontWeight: 'bold' }}>{selectedMarker.hora || 'Sin descripción'}</span></h4>
                  <button onClick={() => handleRouteDrawn()}>Cerrar</button>
                </div>
              )}
  
              {showDirections && (
                <Directions userPosition={userPosition} marker={selectedMarker} />
              )}
            </Map>
          </APIProvider>
        </section>
      </main>
    </div>
  );
};

export default IncidenciasTodas;

function Directions({ userPosition, marker }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;

    // Limpiar la ruta anterior si ya existe un directionsRenderer
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
    }

    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({
      map
    }));
  }, [map, routesLibrary]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    if (!marker || !marker.latitud || !marker.longitud) {
      return;
    }

    const latitud = parseFloat(marker.latitud);
    const longitud = parseFloat(marker.longitud);

    directionsService.route({
      origin: userPosition,
      destination: { lat: latitud, lng: longitud },
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true
    }).then(
      (response) => {
        directionsRenderer.setDirections(response);
      },
      (error) => {
        console.error('Error al obtener la ruta:', error);
      }
    );
  }, [directionsRenderer, directionsService, userPosition, marker]);

  return null;
}