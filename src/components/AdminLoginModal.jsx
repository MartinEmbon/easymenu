import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import "../AdminLoginModal.css";

const AdminLoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "https://userlogin-336444799661.us-central1.run.app",
        { email, password }
      );
  
      const userEmail = response.data.user.email;
      const clienteId = response.data.user.restaurantName;  // Restaurant name is returned as "restaurantName"
  
      // Dispatch user info and store it in localStorage
      dispatch(setUser({
        userInfo: { email: userEmail, clienteId }
      }));
  
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("clienteId", clienteId);
  
      navigate(`/dashboard/${clienteId}`);
    } catch (err) {
      // Show specific error message based on the backend response
      if (err.response) {
        // If the server responds with an error
        setError(err.response.data.error || "Usuario o contraseña incorrectos.");
      } else {
        // For network or other unexpected errors
        setError("An unexpected error occurred.");
      }
    }
  };

//   const handleSignIn = async (e) => {
//     e.preventDefault();
  
//     try {
//       const response = await axios.post(
//         "https://userlogin-336444799661.us-central1.run.app",
//         { email, password }
//       );
  
//       const userEmail = response.data.user.email;
  
//       // Fetch the restaurant name (clienteId) for that email
//       const restaurantRes = await axios.get(
//         `https://get-restaurant-name-336444799661.us-central1.run.app?email=${userEmail}`
//       );
  
//       const clienteId = restaurantRes.data.clienteId;
  
//       dispatch(setUser({
//         userInfo: { email: userEmail, clienteId }
//       }));
  
//       localStorage.setItem("userEmail", userEmail);
//       localStorage.setItem("clienteId", clienteId);
  
//       navigate(`/dashboard/${clienteId}`);
//     } catch (err) {
//       setError("Usuario o contraseña incorrectos.");
//     }
//   };
  
//   const handleSignIn = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         "https://user-login-589432081267.us-central1.run.app",
//         { email, password }
//       );

//       const userData = response.data.user;

//       dispatch(setUser({
//         userInfo: { email: userData.email },
//       }));

//       localStorage.setItem("userEmail", userData.email);

//       navigate("/dashboard");
//     } catch (err) {
//       setError("Usuario o contraseña incorrectos.");
//     }
//   };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Acceder como Admin</h2>
        <form onSubmit={handleSignIn}>
  <div className="form-content">
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
    {error && <p className="error-message">{error}</p>}
    <button type="submit" className="btn">Ingresar</button>
  </div>
</form>

      </div>
    </div>
  );
};

export default AdminLoginModal;
