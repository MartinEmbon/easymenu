import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

const AddDishes = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [items, setItems] = useState([{ name: '', description: '', price: '', imageFile: null, imageUrl: '' }]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { email, clienteId } = useOutletContext();

  useEffect(() => {
    const fetchMenu = async () => {
      if (!email) return;
      try {
        const res = await axios.get("https://list-categories-336444799661.us-central1.run.app", {
          params: { email }
        });
        console.log('Fetched Categories:', res.data);
        const categories = res.data.categories || [];  
        // const categories = (res.data.categories || []).map(name => ({ name }));

        console.log('Processed Categories:', categories);
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
  
    fetchMenu();
  }, [email]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', description: '', price: '', imageFile: null, imageUrl: '' }]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    if (!email || !selectedCategory || items.some(i => !i.name || !i.description || !i.price)) {
      setMessage('Completá todos los campos');
      return;
    }
  
    setLoading(true);
    setMessage('');
  
    try {
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          if (item.imageFile) {
            const publicUrl = await uploadImageToGCS(item.imageFile);
            return { ...item, image: publicUrl, price: parseInt(item.price) };
          }
          return { ...item, price: parseInt(item.price) };
        })
      );
  
      await axios.post("https://register-dishes-336444799661.us-central1.run.app", {
        clienteId,
        category: {
          name: selectedCategory,
          items: updatedItems
        }
      });
  
      setMessage('Producto creado con éxito ✅');
      setItems([{ name: '', description: '', price: '', imageFile: null, image: '' }]);
    } catch (error) {
      console.error(error);
      setMessage('Error al guardar 😞');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (index, file) => {
    const updatedItems = [...items];
    updatedItems[index].imageFile = file;
    setItems(updatedItems);
  };

  const uploadImageToGCS = async (file) => {
    try {
      const response = await axios.post(
        "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/add-cover-photo-album",
        {
          filename: file.name,
          contentType: file.type,
        }
      );
  
      const { uploadUrl, publicUrl } = response.data;
  
      const uploadResponse = await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });
  
      if (uploadResponse.status === 200) {
        return publicUrl;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  console.log("categories",categories);
      console.log("items",items);
  return (
    <div className="dish-form-container">
      <h2 className="form-title">Agregar Producto</h2>
    
      {/* <select
        className="input"
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
      >
        <option value="">Seleccioná una categoría</option>
        {categories.map((cat, i) => (
          <option key={i} value={cat}>{cat}</option>
        ))}
      </select> */}
<select
  className="input"
  value={selectedCategory}
  onChange={e => setSelectedCategory(e.target.value)}
>
  <option value="">Seleccioná una categoría</option>
  {categories.map((cat, i) => (
    <option key={i} value={cat.name}>{cat.name}</option> 
  ))}
</select>
      {items.map((item, index) => (
        <div key={index} className="item-form">
          <input type="text" className="input" placeholder="Nombre del plato" value={item.name} onChange={e => handleItemChange(index, 'name', e.target.value)} />
          <input type="text" className="input" placeholder="Descripción" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} />
          <input type="number" className="input" placeholder="Precio" value={item.price} onChange={e => handleItemChange(index, 'price', e.target.value)} />
          <input
            type="file"
            className="input"
            accept="image/*"
            onChange={e => handleImageChange(index, e.target.files[0])}
          />
          {/* Remove Button */}
          <button type="button" className="remove-item-btn" onClick={() => removeItem(index)}>
            ❌
          </button>
        </div>
      ))}
      <button className="admin-btn" onClick={addItem}>Agregar otro producto</button>
      <button className="admin-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Guardando...' : 'Crear Produto'}
      </button>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default AddDishes;
