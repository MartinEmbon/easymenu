import React, { useState } from 'react';
import './LandingPage.css';
import hero from './assets/images/hero.png';
import logo from './assets/images/logoEMpng.png';
import ContactFormLanding from "./components/ContactFormLanding"
import FaqPreguntas from './components/FaqPreguntas';
const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false); // Close menu after clicking
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo EasyMenu" />
        </div>
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <a onClick={() => scrollToSection('hero')}>Inicio</a>
          <a onClick={() => scrollToSection('features')}>Características</a>
          <a onClick={() => scrollToSection('testimonials')}>Clientes</a>
          <a onClick={() => scrollToSection('faq')}>Preguntas Frecuentes</a>
          <a onClick={() => scrollToSection('contact')}>Contacto</a>
        </div>
        <div className="burger" onClick={toggleMenu}>
          <div className="line" />
          <div className="line" />
          <div className="line" />
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="hero-content">
          <h1>Digitalizá tu menú con facilidad</h1>
          <p>Ofrecé a tus clientes una experiencia digital con menú en QR.</p>
          <a className="cta-button" onClick={() => scrollToSection('contact')}>Escribinos</a>
        
        </div>
        <img src={hero} alt="Hero" className="hero-image" />
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="feature">
          <i className="fa fa-cutlery"></i>
          <h3>Menú interactivo</h3>
          <p>Visual y fácil de navegar para tus clientes.</p>
        </div>
        <div className="feature">
          <i className="fas fa-mobile-alt"></i>
          <h3>Acceso desde cualquier dispositivo</h3>
          <p>Accedé desde tu teléfono, tablet o computadora.</p>
        </div>
        <div className="feature">
          <i className="fa fa-paint-brush"></i>
          <h3>Diseño personalizado</h3>
          <p>Dashboard completo para organizar tus productos</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <h2>Lo que dicen nuestros clientes</h2>
        <div className="testimonial">
          <p>"Una herramienta increíble para mejorar la experiencia de mis clientes."</p>
          <span>- Martín Embon, Damajuana</span>
        </div>
        <div className="testimonial">
          <p>"La mejor forma de digitalizar mi carta. Muy fácil de usar."</p>
          <span>- María Gómez, Los Pinares</span>
        </div>
      </section>

<section id="faq" className="features">
    <FaqPreguntas/>
    {/* <a href="/signup" className="cta-button">Crear mi menú</a> */}

</section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        {/* <h2>¿Listo para transformar tu restaurante?</h2> */}
        {/* <p>Escribinos a <a href="mailto:hola@easymenu.com">hola@easymenu.com</a> o comenzá ahora mismo.</p> */}
        <ContactFormLanding />
        

          </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 EasyMenu. Todos los derechos reservados.</p>
        <p>Corrientes, Argentina | +54 9 379 500-3578</p>
        </footer>
    </div>
  );
};

export default LandingPage;
