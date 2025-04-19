import React, { useState } from 'react';
import axios from 'axios';
import '../DishCategoryInput.css';

const DishCategoryInput = () => {
  const [categoryName, setCategoryName] = useState('');
  const [items, setItems] = useState([
    { name: '', description: '', price: '', image: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', description: '', price: '', image: '' }]);
  };

  const handleSubmit = async () => {
    const email = localStorage.getItem('userEmail'); // o usar Redux

    if (!email || !categoryName || items.some(i => !i.name || !i.description || !i.price)) {
      setMessage('Por favor completá todos los campos');
      return;
    }

    const data = {
      email,
      category: {
        name: categoryName,
        items: items.map(item => ({
          ...item,
          price: parseInt(item.price)
        }))
      }
    };

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('https://register-dishes-336444799661.us-central1.run.app', data);
      setMessage('Categoría guardada con éxito ✅');
      setCategoryName('');
      setItems([{ name: '', description: '', price: '', image: '' }]);
    } catch (error) {
      console.error(error);
      setMessage('Hubo un error al guardar 😞');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dish-form-container">
      <h2 className="form-title">Agregar Categoría de Platos</h2>
      <input
        type="text"
        className="input"
        placeholder="Nombre de la categoría (Ej: Entradas)"
        value={categoryName}
        onChange={e => setCategoryName(e.target.value)}
      />

      {items.map((item, index) => (
        <div key={index} className="item-form">
          <input
            type="text"
            className="input"
            placeholder="Nombre del plato"
            value={item.name}
            onChange={e => handleItemChange(index, 'name', e.target.value)}
          />
          <input
            type="text"
            className="input"
            placeholder="Descripción"
            value={item.description}
            onChange={e => handleItemChange(index, 'description', e.target.value)}
          />
          <input
            type="number"
            className="input"
            placeholder="Precio"
            value={item.price}
            onChange={e => handleItemChange(index, 'price', e.target.value)}
          />
          <input
            type="text"
            className="input"
            placeholder="URL de la imagen"
            value={item.image}
            onChange={e => handleItemChange(index, 'image', e.target.value)}
          />
        </div>
      ))}

      <button className="admin-btn" onClick={addItem}>+ Agregar otro plato</button>
      <button className="admin-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar Categoría'}
      </button>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default DishCategoryInput;
