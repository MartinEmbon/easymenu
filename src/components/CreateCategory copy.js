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
        const categories = (res.data.categories || []).map(name => ({ name }));          
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
        newCategoryName: newCategoryName   // Sending new category name       
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
            {categories.map(({ name }) => (         
              <li key={name} data-id={name} className="category-item">           
                <span>{name}</span>           
                <button onClick={() => handleEditCategory({ name })} className="edit-btn">Editar</button>    
                
                <button onClick={() => handleDeleteCategory(name)} className="delete-btn">Eliminar</button>         
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
