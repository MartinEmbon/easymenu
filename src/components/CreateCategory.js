import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../CreateCategory.css";
import { ReactSortable } from 'react-sortablejs';


const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSuggestion, setIsSuggestion] = useState(false);

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
        // const categories = (res.data.categories || []).map(name => ({ name }));          
        // When fetching categories
        const categories = (res.data.categories || []).map(cat => ({
          name: typeof cat === 'string' ? cat : cat.name,
          suggestion: cat.suggestion || false
        }));


        setCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [email]);

  // Function to handle the icon click
  const handleIconClick = (icon) => {
    setNewCategoryName(prev => prev + icon);
  };


  // Handle creating a new category   
  const handleCreateCategory = async () => {
    if (!email || !newCategoryName) return;
    setLoading(true);
    try {
      await axios.post('https://register-dishes-336444799661.us-central1.run.app', {
        clienteId,
        // category: { name: newCategoryName, items: [] }       
        category: { name: newCategoryName, items: [], suggestion: isSuggestion }

      });
      setCategories(prev => [...prev, { name: newCategoryName }]);
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
    setEditingCategory(categoryName.name);
    setNewCategoryName(categoryName.name);
  };

  // Handle updating the category   
  const handleUpdateCategory = async () => {
    if (!newCategoryName || newCategoryName === editingCategory) return;
    setLoading(true);
    try {
      await axios.put('https://update-category-336444799661.us-central1.run.app', {
        clienteId,
        oldCategoryName: editingCategory,  // Sending old category name         
        // newCategoryName: newCategoryName   
        newCategoryName,
        suggestion: isSuggestion
      });
      setCategories(categories.map(category =>
        category.name === editingCategory ? { name: newCategoryName } : category
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
      setCategories(categories.filter(category => category.name !== categoryName));
      setMessage('Categoría eliminada ✅');
    } catch (err) {
      console.error(err);
      setMessage('Error al eliminar la categoría');
    } finally {
      setLoading(false);
    }
  };
  const handleCategoryOrderChange = async (newList) => {
    // Check if the order has actually changed
    const currentOrder = categories.map(cat => cat.name);
    const isOrderChanged = JSON.stringify(currentOrder) !== JSON.stringify(newList.map(cat => cat.name));

    if (!isOrderChanged) {
      // If the order hasn't changed, exit early
      return;
    }

    // Update UI immediately
    setCategories(newList);

    try {
      const newOrder = newList.map(cat => cat.name);
      await axios.post('https://reorder-category-336444799661.us-central1.run.app', {
        clienteId,
        newOrder,
      });

      // Show success message
      setMessage('Orden de categorías actualizado ✅');

      // Set a timeout to remove the message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000); // Adjust 3000 to any desired duration in milliseconds
    } catch (err) {
      console.error('Error al actualizar el orden de las categorías', err);
      setMessage('Error al actualizar el orden');

      // Set a timeout to remove the error message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };



  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setNewCategoryName('');
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

<div className="icon-helper">
  <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
  Estos íconos le dan vida a tus categorías. Clicá en el que más te guste y sumalo al nombre de tu categoría.  </p>
  <div className="icon-samples" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>

  <span style={{ fontSize: "1.5rem", backgroundColor: "#d0f4de", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('🍺')}>🍺</span>

<span style={{ fontSize: "1.5rem", backgroundColor: "#fff3cd", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('🍽')}>🍽</span>

<span style={{ fontSize: "1.5rem", backgroundColor: "#fde68a", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('🥗')}>🥗</span>

<span style={{ fontSize: "1.5rem", backgroundColor: "#fde2e4", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('🍷')}>🍷</span>
<span style={{ fontSize: "1.5rem", backgroundColor: "#fde2e4", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('🍷')}>🥃</span>


<span style={{ fontSize: "1.5rem", backgroundColor: "#d0f4de", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('🍨')}>🍨</span>

<span style={{ fontSize: "1.5rem", backgroundColor: "#e0e0e0", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('☕')}>☕</span>

<span style={{ fontSize: "1.5rem", backgroundColor: "#fef9c3", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('🥕')}>🥕</span>

<span style={{ fontSize: "1.5rem", backgroundColor: "#fcd5ce", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('🍞')}>🍞</span>

<span style={{ fontSize: "1.5rem", backgroundColor: "#fca5a5", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('🔥')}>🔥</span>

<span style={{ fontSize: "1.5rem", backgroundColor: "#bae6fd", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('🐟')}>🐟</span>

<span style={{ fontSize: "1.5rem", backgroundColor: "#fef3c7", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('🍗')}>🍗</span>

<span style={{ fontSize: "1.5rem", backgroundColor: "#ddd6fe", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('🧀')}>🧀</span>

<span style={{ fontSize: "1.5rem", backgroundColor: "#fde68a", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('🍕')}>🍕</span>

<span style={{ fontSize: "1.5rem", backgroundColor: "#fbcfe8", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('🍔')}>🍔</span>

<span style={{ fontSize: "1.5rem", backgroundColor: "#e0c3fc", padding: "4px 8px", borderRadius: "8px" }} onClick={() => handleIconClick('🎂')}>🎂</span>

  </div>
</div>




        <button
          className="admin-btn"
          onClick={isEditing ? handleUpdateCategory : handleCreateCategory}
          disabled={loading}
        >
          {loading ? 'Procesando...' : isEditing ? 'Actualizar Categoría' : 'Crear Categoría'}
        </button>
        {isEditing && (
          <button
            onClick={handleCancelEdit}
            className="cancel-btn"
          >
            Cancelar
          </button>
        )}
      </div>
      {message && <p className="form-message">{message}</p>}
      <h3>Categorías Existentes</h3>
      <ul className="category-list">
        {categories.length > 0 ? (
          <ReactSortable
            tag="ul"
            className="category-list"
            list={categories}
            setList={handleCategoryOrderChange}
          >
            {categories.map(({ name, suggestion }) => (
              <li key={name} data-id={name} className="category-item">
                <input
                  type="checkbox"
                  checked={suggestion}
                  onChange={async (e) => {
                    const updatedCategories = categories.map(cat =>
                      cat.name === name ? { ...cat, suggestion: e.target.checked } : cat
                    );
                    setCategories(updatedCategories);

                    try {
                      await axios.put('https://update-category-336444799661.us-central1.run.app', {
                        clienteId,
                        oldCategoryName: name,
                        newCategoryName: name, // name remains the same
                        suggestion: e.target.checked,
                      });
                      setMessage(`Categoría "${name}" actualizada ✅`);
                      setTimeout(() => setMessage(''), 3000);
                    } catch (err) {
                      console.error(err);
                      setMessage('Error al actualizar la sugerencia');
                      setTimeout(() => setMessage(''), 3000);
                    }
                  }}
                />
                <span  className="category-name">{name}</span>
                {suggestion && <span className="category-suggestion">🌟 destacada</span>}
                <div className="category-actions">
                <button onClick={() => handleEditCategory({ name })} className="edit-btn">Editar</button>
                <button onClick={() => handleDeleteCategory(name)} className="delete-btn">Eliminar</button>
                </div>
              </li>
              
            ))}

          </ReactSortable>
        ) : (
          <p>No hay categorías disponibles.</p>
        )}
      </ul>
    </div>
  );
};

export default CreateCategory;
