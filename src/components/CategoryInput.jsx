import React, { useState } from 'react';
import axios from 'axios';

const CategoryInput = () => {
  const [categoryName, setCategoryName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email || !categoryName) {
      setMessage('Completá el nombre de la categoría');
      return;
    }

    const data = {
      email,
      category: {
        name: categoryName,
        items: [] // initialize empty
      }
    };

    try {
      await axios.post('https://register-dishes-336444799661.us-central1.run.app', data);
      setMessage('Categoría creada con éxito ✅');
      setCategoryName('');
    } catch (error) {
      console.error(error);
      setMessage('Error al crear la categoría');
    }
  };

  return (
    <div className="dish-form-container">
      <h2 className="form-title">Crear Categoría</h2>
      <input
        type="text"
        className="input"
        placeholder="Ej: Entradas"
        value={categoryName}
        onChange={e => setCategoryName(e.target.value)}
      />
      <button className="admin-btn" onClick={handleSubmit}>Crear Categoría</button>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default CategoryInput;
