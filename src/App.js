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
import CreateCategory from './components/CreateCategory';
import AddDishes from './components/AddDishes';
import EditDishes from './components/EditDishes';
import GeneralInfo from './components/GeneralInfo';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="App">
    <Router>
      <Routes>

      <Route path="/dashboard/:clienteId" element={<PrivateRoute element={<Dashboard />} />}>
  <Route index element={<Navigate to="create" />} /> {/* Redirect to /create by default */}
  <Route path="create" element={<CreateCategory />} />
  <Route path="add" element={<AddDishes />} />
  <Route path="edit" element={<EditDishes />} />
  <Route path="info" element={<GeneralInfo />} />
</Route>

      {/* <Route
  path="/dashboard/:clienteId"
  element={<PrivateRoute element={<Dashboard />} />}
>
  <Route path="create" element={<CreateCategory />} />
  <Route path="add" element={<AddDishes />} />
  <Route path="edit" element={<EditDishes />} />
  <Route path="info" element={<GeneralInfo />} />
</Route> */}

      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard1" element={<MenuInput />} />
      <Route path="/input" element={<DishCategoryInput />} />
      {/* <Route path="/dashboard" element={<CategoryAndDishInput />} /> */}
      {/* <Route path="/dashboard/:clienteId" element={<CategoryAndDishInput />} /> */}
      {/* <Route path="/dashboard/:clienteId" element={<Dashboard />} /> */}
      {/* <Route path="/dashboard/:clienteId" element={<PrivateRoute element={<Dashboard />} />} /> */}

      <Route path="/me.nu/:clienteId" element={<PublicMenu />} />
        {/* Agregá otras rutas si las necesitás */}
      </Routes>
    </Router>
  </div>
  );
}

export default App;
