import React, { useState } from "react";
import axios from "axios";
import "../ContactFormLandingFooter.css"; 

const FooterContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone:""
  });

  const [submitted, setSubmitted] = useState(false); // New state
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "https://contact-form-336444799661.us-central1.run.app",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
  
    //   alert("Mensaje enviado con éxito.");
    setSubmitted(true); // Show thank you message
      setFormData({ name: "", email: "", message: "", phone:""}); // Reset form
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      alert("Error al enviar el mensaje. Intenta nuevamente.");
    }
  };

  return (
    <div className="modal-overlay">
     <div className="footer-contact-modal">
  {submitted ? (
    <div className="thank-you-message">
      <div className="close-button-wrapper">
        <button className="close-button" onClick={handleClose}>✖</button>
      </div>
      <h2>¡Gracias por tu mensaje!</h2>
      <p>Nos pondremos en contacto con vos muy pronto.</p>
    </div>
  ) : (
    <>
      <form onSubmit={handleSubmit} className="contact-form">
      
          <button className="close-button" onClick={handleClose} type="button">✖</button>
    

        <h2>¿Listo para transformar tu restaurante?</h2>

        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          placeholder="Tu nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Teléfono:</label>
        <input
          type="number"
          name="phone"
          placeholder="Tu teléfono de contacto"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label>Correo Electrónico:</label>
        <input
          type="email"
          name="email"
          placeholder="Tu correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Mensaje:</label>
        <textarea
          name="message"
          placeholder="Escribí tu mensaje aquí..."
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn">Enviar</button>
      </form>
    </>
  )}
</div>

    </div>
  );
};

export default FooterContactForm;
