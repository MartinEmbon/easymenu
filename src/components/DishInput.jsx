import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DishInput = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [item, setItem] = useState({ name: '', description: '', price: '', image: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const email = localStorage.getItem('userEmail');
      try {
        const res = await axios.get('https://list-dishes-336444799661.us-central1.run.app', {
          params: { email }
        });
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email || !selectedCategory || !item.name || !item.description || !item.price) {
      setMessage('Completá todos los campos');
      return;
    }

    try {
      const updatedItems = categories.find(cat => cat.name === selectedCategory)?.items || [];
      updatedItems.push({ ...item, price: parseInt(item.price) });

      const data = {
        email,
        category: {
          name: selectedCategory,
          items: updatedItems
        }
      };

      await axios.post('https://register-dishes-336444799661.us-central1.run.app', data);
      setMessage('Plato guardado con éxito ✅');
      setItem({ name: '', description: '', price: '', image: '' });
    } catch (error) {
      console.error(error);
      setMessage('Error al guardar el plato');
    }
  };

  return (
    <div className="dish-form-container">
      <h2 className="form-title">Agregar Plato a Categoría</h2>
      <select className="input" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
        <option value="">Seleccioná una categoría</option>
        {categories.map((cat, i) => (
          <option key={i} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      <input
        type="text"
        className="input"
        placeholder="Nombre del plato"
        value={item.name}
        onChange={e => setItem({ ...item, name: e.target.value })}
      />
      <input
        type="text"
        className="input"
        placeholder="Descripción"
        value={item.description}
        onChange={e => setItem({ ...item, description: e.target.value })}
      />
      <input
        type="number"
        className="input"
        placeholder="Precio"
        value={item.price}
        onChange={e => setItem({ ...item, price: e.target.value })}
      />
      <input
        type="text"
        className="input"
        placeholder="URL de la imagen"
        value={item.image}
        onChange={e => setItem({ ...item, image: e.target.value })}
      />

      <button className="admin-btn" onClick={handleSubmit}>Guardar Plato</button>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default DishInput;
