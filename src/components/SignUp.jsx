import React, { useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../SignUp.css';
import logoEM from "../assets/images/logoEMpng.png"

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("")
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
      restaurantName
    };

    try {
      const response = await axios.post(
        "https://register-user-336444799661.us-central1.run.app",
        userData
      );
      setSuccessMessage(response.data.message);
      setEmail("");
      setPassword("");
      setRestaurantName("")
      setError("");
      setTimeout(() => navigate(`/me.nu/${restaurantName}`), 2000);  // Navigate using restaurantName as clienteId
    } catch (error) {
      setError(error.response?.data || "Ocurrió un error al registrarte.");
      setSuccessMessage("");
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-left">
          <h2>Registrate en EasyMenu</h2>
          <p>Creá tu menú digital fácil y rápido.</p>

          <form onSubmit={handleSignUp} className="signup-form">
          <input
              type="text"
              placeholder="Nombre de tu restaurant"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn">
              Crear Cuenta
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
        </div>

        <div className="signup-right">
          {/* <h3>Financiá tu futuro</h3> */}
          {/* <p>Descubrí cómo nuestros créditos educativos pueden ayudarte.</p> */}
          <img src={logoEM} alt="CrediEstudio" />
        </div>
      </div>
     
    </>
  );
};

export default SignUp;
