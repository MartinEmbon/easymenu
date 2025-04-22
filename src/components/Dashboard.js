import React, { useState, useEffect } from 'react';
import { Link, Outlet, useParams, useNavigate, useLocation  } from 'react-router-dom';
import logo from '../assets/images/logoEMpng.png';
import CreateCategory from './CreateCategory';
import AddDishes from './AddDishes';
import EditDishes from './EditDishes';
import GeneralInfo from './GeneralInfo';
import '../Dashboards.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { clienteId } = useParams(); // get the dynamic param
const location = useLocation()
  const email = localStorage.getItem('userEmail');
  
  // State for toggling the menu
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('clienteId');
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  // Function to close the menu when an item is clicked
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // 👇 Automatically close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-header">
          <img src={logo} alt="Logo EasyMenu" className="navbar-logo" />
        </div>
        
        {/* Hamburger Menu */}
        <div className="hamburger-menu" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* Navbar Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <Link to={`/dashboard/${clienteId}/create`} className="nav-link">Categorías</Link>
          <Link to={`/dashboard/${clienteId}/add`} className="nav-link">Agregar Producto</Link>
          <Link to={`/dashboard/${clienteId}/edit`} className="nav-link">Editar Producto</Link>
          <Link to={`/dashboard/${clienteId}/info`} className="nav-link">Info Establecimiento</Link>
          <button className="logout-btn" onClick={handleLogout}>Salir</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <Outlet context={{ email, clienteId }} />
      </div>
    </div>
  );
};

export default Dashboard;
