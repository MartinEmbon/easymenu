import React, { useState } from "react";
import "../ContactFormLanding.css"; 

import axios from "axios";
const ContactFormLanding = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
     phone:""
  });

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
  
      alert("Mensaje enviado con éxito.");
      setFormData({ name: "", email: "", message: "", phone:""}); // Reset form
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      alert("Error al enviar el mensaje. Intenta nuevamente.");
    }
  };


  return (
    <div className="contact-container">
      <h2>¿Listo para transformar tu restaurante?</h2>

      <form onSubmit={handleSubmit} className="contact-form">
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
    </div>
  );
};

export default ContactFormLanding;
