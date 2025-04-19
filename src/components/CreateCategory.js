import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../CreateCategory.css";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const email = localStorage.getItem('userEmail');
  const clienteId = localStorage.getItem('clienteId');

  // Fetch existing categories based on email
  useEffect(() => {
    const fetchCategories = async () => {
      if (!email) return;
      try {
        const res = await axios.get("https://list-categories-336444799661.us-central1.run.app", {
          params: { email }
        });

        console.log('API Response:', res.data);

        const categories = res.data.categories || []; 
        setCategories(categories);

      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [email]);

  // Handle creating a new category
  const handleCreateCategory = async () => {
    if (!email || !newCategoryName) return;
    setLoading(true);
    try {
      await axios.post('https://register-dishes-336444799661.us-central1.run.app', {
        clienteId,
        category: { name: newCategoryName, items: [] }
      });
      setCategories(prev => [...prev, newCategoryName]);
      setNewCategoryName('');
      setMessage('Categoría creada ✅');
    } catch (err) {
      console.error(err);
      setMessage('Error al crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a category
  const handleEditCategory = (categoryName) => {
    setIsEditing(true);
    setEditingCategory(categoryName);
    setNewCategoryName(categoryName);
  };

  // Handle updating the category
  const handleUpdateCategory = async () => {
    if (!newCategoryName || newCategoryName === editingCategory) return;
    setLoading(true);
    try {
      await axios.put('https://update-category-336444799661.us-central1.run.app', {
        clienteId,
        oldCategoryName: editingCategory,  // Sending old category name
        newCategoryName: newCategoryName   // Sending new category name
      });
      setCategories(categories.map(category => 
        category === editingCategory ? newCategoryName : category
      ));
      setMessage('Categoría actualizada ✅');
      setIsEditing(false);
      setEditingCategory(null);
      setNewCategoryName('');
    } catch (err) {
      console.error(err);
      setMessage('Error al actualizar la categoría');
    } finally {
      setLoading(false);
    }
  };
  

  // Handle deleting a category
  const handleDeleteCategory = async (categoryName) => {
    setLoading(true);
    try {
      await axios.delete('https://delete-category-336444799661.us-central1.run.app', {
        data: { clienteId, categoryName }
      });
      setCategories(categories.filter(category => category !== categoryName));
      setMessage('Categoría eliminada ✅');
    } catch (err) {
      console.error(err);
      setMessage('Error al eliminar la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-form-container">
      <h2 className="form-title">{isEditing ? 'Editar Categoría' : 'Crear Categoría'}</h2>

      <div>
        <input
          type="text"
          className="input"
          placeholder="Nombre de la categoría"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
        />
        <button 
          className="admin-btn" 
          onClick={isEditing ? handleUpdateCategory : handleCreateCategory} 
          disabled={loading}
        >
          {loading ? 'Procesando...' : isEditing ? 'Actualizar Categoría' : 'Crear Categoría'}
        </button>
      </div>

      {message && <p className="form-message">{message}</p>}

      <h3>Categorías Existentes</h3>
      <ul className="category-list">
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <li key={index} className="category-item">
              <span>{category}</span>
              <button onClick={() => handleEditCategory(category)} className="edit-btn">Editar</button>
              <button onClick={() => handleDeleteCategory(category)} className="delete-btn">Eliminar</button>
            </li>
          ))
        ) : (
          <li>No hay categorías disponibles.</li>
        )}
      </ul>
    </div>
  );
};

export default CreateCategory;
