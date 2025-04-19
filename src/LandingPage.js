import React from 'react';
import './LandingPage.css';  // Custom CSS for styling
import hero from "./assets/images/hero.png";
import logo from "./assets/images/logoEMpng.png"; // Add your logo image

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Logo Section */}
      <div className="logo-container">
        <img src={logo} alt="EasyMenu Logo" className="logo" />
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Transforma tu menú con facilidad</h1>
          <p>Ofrece a tus clientes una experiencia digital con nuestro menú interactivo y fácil de usar.</p>
          <a href="/signup" className="cta-button">Comienza ahora</a>
        </div>
        <img src={hero} alt="Hero Image" className="hero-image" />
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature">
          <i className="fa fa-cutlery"></i>
          <h3>Menú interactivo</h3>
          <p>Un menú visual y fácil de navegar para tus clientes.</p>
        </div>
        <div className="feature">
          <i className="fas fa-mobile-alt"></i>
          <h3>Acceso desde cualquier dispositivo</h3>
          <p>Accede al menú desde tu teléfono, tablet o computadora.</p>
        </div>
        <div className="feature">
          <i className="fa fa-paint-brush"></i>
          <h3>Diseño personalizado</h3>
          <p>Personaliza el menú para que coincida con la identidad de tu marca.</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>Lo que dicen nuestros clientes</h2>
        <div className="testimonial">
          <p>"Una herramienta increíble para mejorar la experiencia de mis clientes. ¡Recomendado!"</p>
          <span>- Juan Pérez, Restaurante X</span>
        </div>
        <div className="testimonial">
          <p>"La mejor forma de digitalizar mi negocio. Muy fácil de usar."</p>
          <span>- María Gómez, Restaurante Y</span>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2025 Mi Restaurante Digital. Todos los derechos reservados.</p>
        <p><a href="/privacy-policy">Política de privacidad</a> | <a href="/terms">Términos de servicio</a></p>
      </footer>
    </div>
  );
};

export default LandingPage;
