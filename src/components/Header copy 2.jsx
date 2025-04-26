import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useGeneralInfo } from "../hooks/useGeneralInfo";
import { Helmet } from "react-helmet"; // Import react-helmet

import "../header.css";

const Header = ({ clienteId: propClienteId }) => {
  const { clienteId: urlClienteId } = useParams();
  const clienteId = propClienteId || urlClienteId;
  const { generalInfo } = useGeneralInfo(clienteId);
  const phone = generalInfo.phone || "";
  const logoUrl = generalInfo.profilePictureUrl || "";

  // const [logoUrl, setLogoUrl] = useState("");
  // const [phone, setPhone] = useState("");
  const endpointBase = 'https://get-general-info-336444799661.us-central1.run.app';

  // useEffect(() => {
  //   const fetchHeaderData = async () => {
  //     if (!clienteId) return;

  //     try {
  //       const response = await axios.get(`${endpointBase}/getGeneralInfo`, {
  //         params: { clienteId },
  //       });

  //       if (response.data && response.data.generalInfo) {
  //         const { phone, profilePictureUrl } = response.data.generalInfo;
  //         setPhone(phone || "");
  //         setLogoUrl(profilePictureUrl || "");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching header data:", error);
  //     }
  //   };

  //   fetchHeaderData();
  // }, [clienteId]);

  const whatsappLink = phone ? `https://wa.me/${phone.replace(/[^0-9]/g, "")}` : "#";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mirá la carta de nuestro restaurante",
          text: "¡Te va a encantar esta carta digital!",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Tu navegador no soporta la función de compartir.");
    }
  };


//   <a href={`tel:${phone}`} title="Llamar">
//   <i className="fa fa-phone icon phone"></i>
// </a>
// <a href={whatsappLink} target="_blank" rel="noopener noreferrer" title="Enviar WhatsApp">
//   <i className="fa-brands fa-whatsapp icon whatsapp"></i>
// </a>
// <button onClick={handleShare} className="share-btn" title="Compartir">
//   <i className="fa fa-share-alt icon share"></i>
// </button>



  return (
    <header className="menu-header">
      
<Helmet>
        <meta property="og:title" content="Mirá la carta de nuestro restaurante" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:description" content="¡Te va a encantar esta carta digital!" />
        {logoUrl && <meta property="og:image" content={logoUrl} />} {/* Dynamically set the logo */}
        <meta property="og:image:alt" content="Logo del restaurante" />
        <meta property="og:image:type" content="image/png" />
      </Helmet>
      <div className="logo-container-nav">
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo del restaurante"
            className="restaurant-logo"
          />
        )}
      </div>

      <div className="restaurant-info">
        <div className="contact-icons">
          {phone && (
            <a href={`tel:${phone}`} title="Llamar">
              <i className="fa fa-phone icon phone"></i>
            </a>
          )}
          {phone && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Enviar WhatsApp"
            >
              <i
                className="fa-brands fa-whatsapp icon whatsapp"
          
              ></i>
            </a>
          )}
          <button onClick={handleShare} className="share-btn" title="Compartir">
            <i className="fa-solid fa-share icon share"></i>
           

          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
