import logoDJ from "../assets/images/logoDJ-removebg-preview.png"
import frente_local from "../assets/images/frente_local.jfif"
import "../header.css"

const Header = () => (
  <header className="menu-header">
    {/* Dynamic Meta Tags */}
    <Helmet>
        <meta property="og:title" content="Mirá la carta de nuestro restaurante" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:description" content="¡Te va a encantar esta carta digital!" />
        {logoUrl && <meta property="og:image" content={logoUrl} />} {/* Dynamically set the logo */}
        <meta property="og:image:alt" content="Logo del restaurante" />
        <meta property="og:image:type" content="image/png" />
      </Helmet>
      
    <div className="logo-container">
      <img src={logoDJ} alt="Logo del restaurante" className="restaurant-logo" />
    </div>
    <div className="restaurant-info">
      {/* <p>📍 San Martín 85</p>
      <p>🕐 Abierto de 18:00 a 23:00</p> */}
            {/* <p>San Martín 85 ● Abierto de 18:00 a 23:00</p> */}

    </div>
    {/* <div className="restaurant-banner">
      <img
        src={frente_local}
        alt="Imagen del restaurante"
        className="banner-image"
      />
    </div> */}

   
  </header>
);

export default Header;
