import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import AdminLoginModal from './AdminLoginModal';
import { useParams } from 'react-router-dom';
import "../Footer.css"
const Footer = ({ clienteId: propClienteId }) => {
    const { clienteId: urlClienteId } = useParams();
    const clienteId = propClienteId || urlClienteId;
    const [showAllHours, setShowAllHours] = useState(false);
    const hoursRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState('30px');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [contactInfo, setContactInfo] = useState({
        email: '',
        phone: '',
        address: '',
        hours: '',
        instagram: '',
        facebook: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const endpointBase = 'https://get-general-info-336444799661.us-central1.run.app';

    useEffect(() => {
        if (hoursRef.current) {
          if (showAllHours) {
            setMaxHeight(`${hoursRef.current.scrollHeight}px`);
          } else {
            setMaxHeight('30px');
          }
        }
      }, [showAllHours, contactInfo.hours]);


    useEffect(() => {
        const fetchContactInfo = async () => {
            if (!clienteId) {
                console.error('No clienteId provided');
                setError('❌ clienteId no disponible');
                return;
            }

            try {
                setLoading(true);
                console.log('Fetching contact info for clienteId:', clienteId);

                const response = await axios.get(`${endpointBase}/getGeneralInfo`, {
                    params: { clienteId },
                });
                console.log('API response', response)
                if (response.data && response.data.generalInfo) {
                    const { email, phone, address, hours, instagram, facebook } = response.data.generalInfo;

                    setContactInfo({
                        hours: hours,
                        address: address,
                        email: email,
                        phone: phone,
                        instagram: instagram || '',
                        facebook: facebook || '',
                    });
                } else {
                    console.error('No generalInfo found in the response:', response.data);
                    setError('❌ No se encontró la información de contacto');
                }
            } catch (error) {
                console.error('Error fetching contact info:', error);
                setError('❌ Error al cargar la información de contacto');
            } finally {
                setLoading(false);
            }
        };

        fetchContactInfo();
    }, [clienteId]);

    return (
        <footer className="footer">
            <div className="footer-content">
                {loading ? (
                    <p>Cargando contacto...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <>
                        <p>
                            <i className="fa fa-map-marker" style={{ marginRight: '8px' }}></i>
                            Dirección: {contactInfo.address}
                        </p>
                        <p>
                            <i className="fa fa-envelope" style={{ marginRight: '8px' }}></i>
                            Contacto: <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                        </p>
                        <p>
                            <i className="fa fa-phone" style={{ marginRight: '8px' }}></i>
                            Teléfono: <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                        </p>
                        {contactInfo.hours && Object.values(contactInfo.hours).some(h => h) && (
  <div className="footer-hours">
    <h4>
      <i className="fa fa-clock-o" style={{ marginRight: '6px' }}></i>Horarios de atención:
    </h4>

    <ul
      className="hours-list"
      ref={hoursRef}
      style={{
        maxHeight,
        overflow: 'hidden',
        transition: 'max-height 0.4s ease-in-out',
      }}
    >
      {Object.entries(contactInfo.hours)
        .filter(([_, h]) => h)
        .map(([day, hours]) => (
          <li key={day}>
            {day.charAt(0).toUpperCase() + day.slice(1)}: {hours}
          </li>
        ))}
    </ul>

    {Object.values(contactInfo.hours).filter(h => h).length > 1 && (
      <button className="toggle-hours-btn" onClick={() => setShowAllHours(!showAllHours)}>
        <i className={`fa ${showAllHours ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
      </button>
    )}
  </div>
)}


                        <div className="social-links">
                            {contactInfo.instagram && (
                                <a
                                    href={`https://www.instagram.com/${contactInfo.instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                >

                                    <i className="fa-brands fa-instagram" style={{ marginRight: '10px', fontSize: '1.2rem' }}></i>
                                </a>
                            )}
                            {contactInfo.facebook && (
                                <a
                                    href={`https://www.facebook.com/${contactInfo.facebook}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                >
                                    <i className="fa-brands fa-facebook" style={{ fontSize: '1.2rem' }}></i>
                                </a>
                            )}
                        </div>
                    </>
                )}

                <button className="admin-btn" onClick={() => setShowLoginModal(true)}>
                    Acceder como admin
                </button>

                <div className="footer-easymenu">
  <p>
    ¿Querés tener tu carta digital como esta? Visitá&nbsp;
    <a href="https://easymenu.com" target="_blank" rel="noopener noreferrer">
      easymenu.com
    </a>
  </p>
</div>

                <AdminLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            </div>
        </footer>
    );
};

export default Footer;
