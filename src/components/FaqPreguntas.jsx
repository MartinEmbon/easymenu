import React, { useState } from "react";
import "../FaqPreguntas.css"; // Asegurate de tener este archivo
import imagenFaq from "../assets/images/qr.png"; // Asegurate de tener una imagen en tu carpeta de assets
import imagen2 from "../assets/images/menuqr.png"
const preguntasFrecuentes = [
  {
    question: "¿Cómo funciona el menú QR?",
    answer: "Te generamos un código QR único que tus clientes pueden escanear con su celular para acceder al menú digital, sin necesidad de descargar ninguna app.",
  },
  {
    question: "¿Puedo actualizar el menú cuando quiera?",
    answer: "Sí. Podés editar precios, productos, fotos y descripciones en cualquier momento desde tu panel de control. Los cambios se actualizan al instante.",
  },
  {
    question: "¿Qué necesito para empezar?",
    answer: "Solo completá el formulario de contacto y nos pondremos en contacto para crear tu menú QR personalizado en menos de 24 horas.",
  },
  {
    question: "¿Tiene algún costo mensual?",
    answer: "Ofrecemos un plan gratuito básico de prueba y después suscripción mensual.",
  },
  {
    question: "¿Puedo mostrar promociones o combos especiales?",
    answer: "Claro. Podés destacar promociones, combos o platos del día directamente desde el panel.",
  },
];

const FaqPreguntas = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-wrapper">
      <div className="faq-image">
        <img src={imagen2} alt="Preguntas frecuentes" />
      </div>
      <div className="faq-section">
        <h2>Preguntas Frecuentes</h2>
        {preguntasFrecuentes.map((item, index) => (
          <div key={index} className="faq-item">
            <button
              className="faq-question"
              onClick={() => toggleAnswer(index)}
            >
              {item.question}
              <span>{openIndex === index ? "▲" : "▼"}</span>
            </button>
            <div className={`faq-answer ${openIndex === index ? "open" : ""}`}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqPreguntas;
