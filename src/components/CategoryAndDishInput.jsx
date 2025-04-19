import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams

const CategoryAndDishInput = () => {
//   const { clienteId } = useParams(); // Get clienteId from the URL
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [items, setItems] = useState([{ name: '', description: '', price: '', image: '' }]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem('userEmail');
  const clienteId = localStorage.getItem('clienteId'); 

  // Fetch existing categories based on clienteId
  console.log("📦 Sending to list-dishes:", { email });
  console.log("📨 Fetching menu with email:", email);

  useEffect(() => {
    const fetchMenu = async () => {
      if (!email) return;
      const res = await axios.get("https://list-categories-336444799661.us-central1.run.app", {
        params: { email }
      });
      const categories = res.data.categories?.map(c => c.name) || [];
      setCategories(categories);
    };
    fetchMenu();
  }, [email]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', description: '', price: '', image: '' }]);
  };

  const handleSubmit = async () => {
    if (!email || !selectedCategory || items.some(i => !i.name || !i.description || !i.price)) {
      setMessage('Completá todos los campos');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post("https://register-dishes-336444799661.us-central1.run.app", {
        clienteId,
      
        category: {
          name: selectedCategory,
          items: items.map(item => ({ ...item, price: parseInt(item.price) }))
        }
      });

      setMessage('Platos guardados con éxito ✅');
      setItems([{ name: '', description: '', price: '', image: '' }]);
    } catch (error) {
      console.error(error);
      setMessage('Error al guardar 😞');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!email || !newCategoryName) return;
    try {
      await axios.post('https://register-dishes-336444799661.us-central1.run.app', {
        clienteId,
     
        category: { name: newCategoryName, items: [] }
      });
      setCategories(prev => [...prev, newCategoryName]);
      setSelectedCategory(newCategoryName);
      setNewCategoryName('');
      setMessage('Categoría creada ✅');
    } catch (err) {
      console.error(err);
      setMessage('Error al crear la categoría');
    }
  };

  return (
    <div className="dish-form-container">
      <h2 className="form-title">Crear o Seleccionar Categoría</h2>

      <select
        className="input"
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
      >
        <option value="">Seleccioná una categoría</option>
        {categories.map((cat, i) => (
          <option key={i} value={cat}>{cat}</option>
        ))}
      </select>

      <div style={{ marginTop: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          className="input"
          placeholder="Nueva categoría (opcional)"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
        />
        <button className="admin-btn" onClick={handleCreateCategory}>Crear Categoría</button>
      </div>

      <h3 className="form-title">Agregar Platos</h3>

      {selectedCategory && (
        <div className="item-form">
          <input
            type="text"
            className="input"
            value={selectedCategory}
            readOnly
            disabled
            style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}
          />
        </div>
      )}

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

      <button className="admin-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar Platos en Categoría'}
      </button>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default CategoryAndDishInput;
