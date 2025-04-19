import React from 'react';
import PublicMenu from './components/PublicMenu';
import { BrowserRouter as Router, Route, Routes, UNSAFE_createClientRoutesWithHMRRevalidationOptOut } from 'react-router-dom';
import './styles.css';
import ClienteMenu from './pages/ClienteMenu';
import SignUp from './components/SignUp';
import MenuInput from './components/MenuInput';
import DishCategoryInput from './components/DishCategoryInput';
import DishInput from './components/DishInput';
import CategoryAndDishInput from './components/CategoryAndDishInput';
import Dashboard from './components/Dashboard';
import PrivateRoute from "./ProtectedRoute"
import LandingPage from './LandingPage';

function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard1" element={<MenuInput />} />
      <Route path="/input" element={<DishCategoryInput />} />
      {/* <Route path="/dashboard" element={<CategoryAndDishInput />} /> */}
      {/* <Route path="/dashboard/:clienteId" element={<CategoryAndDishInput />} /> */}
      {/* <Route path="/dashboard/:clienteId" element={<Dashboard />} /> */}
      <Route path="/dashboard/:clienteId" element={<PrivateRoute element={<Dashboard />} />} />

      <Route path="/me.nu/:clienteId" element={<PublicMenu />} />
        {/* Agregá otras rutas si las necesitás */}
      </Routes>
    </Router>
  </div>
  );
}

export default App;
