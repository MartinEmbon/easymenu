import React, { useState, useRef, useEffect } from 'react';
import AdminLoginModal from './AdminLoginModal';
import { useParams } from 'react-router-dom';
import { useGeneralInfo } from "../hooks/useGeneralInfo";
import FooterContactForm from './ContactFormFooter';
import "../Footer.css";

const Footer = ({ clienteId: propClienteId }) => {
    const { clienteId: urlClienteId } = useParams();
    const clienteId = propClienteId || urlClienteId;

    const [showAllHours, setShowAllHours] = useState(false);
    const hoursRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState('30px');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const { generalInfo, loading, error } = useGeneralInfo(clienteId);

    const {
        email = '',
        phone = '',
        address = '',
        hours = '',
        instagram = '',
        facebook = '',
    } = generalInfo || {};

    const toggleFormVisibility = () => {
        setShowForm((prevState) => !prevState); // Toggle visibility of the form
      };
    useEffect(() => {
        if (hoursRef.current) {
            if (showAllHours) {
                setMaxHeight(`${hoursRef.current.scrollHeight}px`);
            } else {
                setMaxHeight('30px');
            }
        }
    }, [showAllHours, hours]);

    return (
        <footer className="footer">
            <div className="footer-content">
                {loading ? (
                    <p>Cargando contacto...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <>
                        {address && (
                            <p>
                                <i className="fa fa-map-marker" style={{ marginRight: '8px' }}></i>
                                Dirección: {address}
                            </p>
                        )}
                        {email && (
                            <p>
                                <i className="fa fa-envelope" style={{ marginRight: '8px' }}></i>
                                Contacto: <a href={`mailto:${email}`}>{email}</a>
                            </p>
                        )}
                        {phone && (
                            <p>
                                <i className="fa fa-phone" style={{ marginRight: '8px' }}></i>
                                Teléfono: <a href={`tel:${phone}`}>{phone}</a>
                            </p>
                        )}
                        {hours && Object.values(hours).some(h => h) && (
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
                                    {Object.entries(hours)
                                        .filter(([_, h]) => h)
                                        .map(([day, value]) => (
                                            <li key={day}>
                                                {day.charAt(0).toUpperCase() + day.slice(1)}: {value}
                                            </li>
                                        ))}
                                </ul>

                                {Object.values(hours).filter(h => h).length > 1 && (
                                    <button className="toggle-hours-btn" onClick={() => setShowAllHours(!showAllHours)}>
                                        <i className={`fa ${showAllHours ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="social-links">
                            {instagram && (
                                <a
                                    href={`https://www.instagram.com/${instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                >
                                    <i className="fa-brands fa-instagram" style={{ marginRight: '10px', fontSize: '1.2rem' }}></i>
                                </a>
                            )}
                            {facebook && (
                                <a
                                    href={`https://www.facebook.com/${facebook}`}
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
                    {/* <p>
                        ¿Querés tener tu carta digital como esta? Visitá&nbsp;
                        <a href="https://easymenu.com" target="_blank" rel="noopener noreferrer">
                            easymenu.com
                        </a>
                    </p> */}

<p>
  ¿Querés tener tu carta digital como esta?{" "}
  <button onClick={toggleFormVisibility} className="cta-link-btn">
    Clicá acá
  </button>
</p>



                </div>
      {showForm && <FooterContactForm />}

                <AdminLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            </div>
        </footer>
    );
};

export default Footer;
