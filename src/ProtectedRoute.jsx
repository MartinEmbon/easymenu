import { Navigate } from 'react-router-dom';

// Componente de ruta privada
const ProtectedRoute = ({ element, ...rest }) => {
  // Verificar si los datos de autenticación están en localStorage
  const userEmail = localStorage.getItem("userEmail");
  const clienteId = localStorage.getItem("clienteId");

  // Si no hay usuario o clienteId en localStorage, redirigir al login
  if (!userEmail || !clienteId) {
    return <Navigate to="/" />;
  }

  // Si están presentes, renderizar la ruta
  return element;
};
export default ProtectedRoute;
