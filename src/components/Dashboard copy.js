import React, { useState } from 'react';
import CreateCategory from './CreateCategory';
import AddDishes from './AddDishes';
import EditDishes from './EditDishes';
import GeneralInfo from './GeneralInfo';
import logo from '../assets/images/logoEMpng.png';

import "../Dashboards.css"
const Dashboard = () => {
  const email = localStorage.getItem('userEmail');
  const clienteId = localStorage.getItem('clienteId');
  const [activeTab, setActiveTab] = useState('create');

  const handleLogout = () => {
    // Clear the localStorage and navigate back to the previous page
    localStorage.removeItem('userEmail');
    localStorage.removeItem('clienteId');
    window.history.back(); // Navigate to the previous page
  };

  const renderTab = () => {
    if (activeTab === 'create') return <CreateCategory email={email} clienteId={clienteId} onCategoryCreated={() => setActiveTab('add')} />;
    if (activeTab === 'add') return <AddDishes email={email} clienteId={clienteId} />;
    if (activeTab === 'edit') return <EditDishes email={email} />;
    if (activeTab === 'info') return <GeneralInfo email={email} clienteId={clienteId} />;

  };

  return (
    <div className="dashboard-container">
      <div className="navbar">
      <div className="navbar-logo">
          <img src={logo} alt="Logo EasyMenu" />
        </div>
        <button className={`nav-btn ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>Crear Categoría</button>
        <button className={`nav-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>Agregar Producto</button>
        <button className={`nav-btn ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab('edit')}>Editar Producto</button>
        <button className={`nav-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
  Info Establecimiento
</button>

        <button className="logout-btn" onClick={handleLogout}>Salir</button>
      </div>

      {renderTab()}
    </div>
  );
};

export default Dashboard;
