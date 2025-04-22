import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from './Modal';  // Import the modal component
import { useOutletContext } from 'react-router-dom';

import "../EditDish.css"
const EditDishes = () => {
    const [categories, setCategories] = useState([]);
    const [editableItem, setEditableItem] = useState(null);  // To track the dish being edited
    // const { clienteId } = useParams(); // e.g. user@email.com
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); // To track which item to delete
    const { email } = useOutletContext();        // ✅ get email from context
    const { clienteId } = useParams();           // ✅ get clienteId from URL params
      
    useEffect(() => {
        const fetchCategories = async () => {
            if (!email) return;
            const res = await axios.get("https://list-dishes-336444799661.us-central1.run.app", {
                params: { clienteId }
            });
            console.log("list",res)
            setCategories(res.data.categories || []);
        };
      
        fetchCategories();
    }, [email, clienteId]);

    // Upload image and get the public URL
    const uploadImageToGCS = async (file) => {
        try {
            const response = await axios.post(
                "https://us-central1-moonlit-sphinx-400613.cloudfunctions.net/add-cover-photo-album",
                // "https://add-pictures-336444799661.us-central1.run.app",
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

    // Function to handle editing a field of a dish
    const handleEditClick = (catIndex, itemIndex, field, currentValue) => {
        setEditableItem({
            catIndex,
            itemIndex,
            field,
            currentValue: categories[catIndex].items[itemIndex][field],
            originalName: categories[catIndex].items[itemIndex].name, // still needed for itemId
        });
    };

    // Function to handle saving the edited value
    const handleSave = async (catIndex, itemIndex, field, newValue) => {
        try {
            const updatedCategories = [...categories];
            updatedCategories[catIndex].items[itemIndex][field] = newValue;
            setCategories(updatedCategories); // Update UI instantly

            // Make an API call to save the changes
            await axios.put("https://update-dish-336444799661.us-central1.run.app", {
                clienteId,
                categoryName: updatedCategories[catIndex].name,
                itemId: editableItem.originalName, // ✅ not the updated one
                field,
                value: newValue,
            });

            setEditableItem(null); // Hide the edit field after saving
        } catch (error) {
            console.error("Error saving dish:", error);
        }
    };

    // Function to handle image file change and upload
    const handleImageChange = async (catIndex, itemIndex, file) => {
        try {
            const publicUrl = await uploadImageToGCS(file);
            // Update the image URL in the categories state
            const updatedCategories = [...categories];
            updatedCategories[catIndex].items[itemIndex].image = publicUrl;
            setCategories(updatedCategories);
            // Call the API to update the dish with the new image
            await axios.put("https://update-dish-336444799661.us-central1.run.app", {
                clienteId,
                categoryName: updatedCategories[catIndex].name,
                itemId: categories[catIndex].items[itemIndex].name, // use the item name or id
                field: 'image',
                value: publicUrl,
            });
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    // Function to handle dish deletion
    const handleDelete = async () => {
        if (!itemToDelete) return;
        const { catIndex, itemIndex } = itemToDelete;
    
        try {
            const dishToDelete = categories[catIndex].items[itemIndex];
    
            await axios.delete("https://delete-dish-336444799661.us-central1.run.app", {
                data: {
                    clienteId,
                    categoryName: categories[catIndex].name,
                    itemId: dishToDelete.name,
                }
            });
    
            const updatedCategories = [...categories];
            updatedCategories[catIndex].items.splice(itemIndex, 1);
            setCategories(updatedCategories);
            setIsModalOpen(false);
            console.log(`✅ Dish '${dishToDelete.name}' deleted successfully`);
        } catch (error) {
            console.error("❌ Error deleting dish:", error);
            alert("Error al eliminar el plato.");
        }
    };
// Function to trigger modal for deletion confirmation
const openDeleteModal = (catIndex, itemIndex) => {
    setItemToDelete({ catIndex, itemIndex });
    setIsModalOpen(true);
};

// Function to handle moving the dish to a different category
const handleMoveDish = async (catIndex, itemIndex, newCategoryName) => {
    try {
      const itemToMove = categories[catIndex].items[itemIndex];
      // Find the new category
      const newCategory = categories.find((cat) => cat.name === newCategoryName);
  
      // Remove the dish from the current category
      const updatedCategories = [...categories];
      updatedCategories[catIndex].items.splice(itemIndex, 1);
  
      // Add the dish to the new category
      newCategory.items.push(itemToMove);
  
      // Update the state
      setCategories(updatedCategories);
  
      // Call the backend function to move the dish
      await axios.put("https://update-dish-336444799661.us-central1.run.app", {
        clienteId,
        categoryName: newCategoryName,
        itemId: itemToMove.name,
        field: 'category',
        value: newCategoryName,
      });
  
      console.log(`✅ Dish '${itemToMove.name}' moved to category '${newCategoryName}' successfully`);
    } catch (error) {
      console.error("Error moving dish:", error);
    }
  };
  
  
  
return (
    <div className="dish-form-container">
        <h2 className="form-title">Editar / Eliminar Platos</h2>
        {categories.map((cat, catIndex) => (
            <div key={catIndex} className="category-section">
                <h4 className="category-title">{cat.name}</h4>
                {(cat.items || []).map((item, itemIndex) => (
                    <div key={itemIndex} className="item-form">
                        {editableItem?.catIndex === catIndex &&
                        editableItem?.itemIndex === itemIndex &&
                        editableItem?.field !== 'image' ? (
                            <>
                                <input
                                    type={editableItem.field === "price" ? "number" : "text"}
                                    value={editableItem.currentValue}
                                    onChange={(e) =>
                                        setEditableItem({ ...editableItem, currentValue: e.target.value })
                                    }
                                    className="edit-input"
                                />
                                <button
                                    onClick={() =>
                                        handleSave(catIndex, itemIndex, editableItem.field, editableItem.currentValue)
                                    }
                                    className="save-button"
                                >
                                    Guardar
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="item-preview">
                               
                                <div>
  <label>Categoria:</label>
  <select
  value={item.category || cat.name} // Default to current category if available
  onChange={async (e) => {
    const newCategory = e.target.value;
    if (newCategory !== cat.name) {
      await handleMoveDish(catIndex, itemIndex, newCategory); // Move dish to new category
    }
  }}
>
  {categories.map((category) => (
    <option key={category.name} value={category.name}>
      {category.name}
    </option>
  ))}
</select>
</div>

                                    <strong>{item.name}</strong>: Descripción: {item.description} - Precio: ${item.price}
                                </p>
                                <label className="image-label">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="dish-image"
                                        onClick={() =>
                                            setEditableItem({
                                                catIndex,
                                                itemIndex,
                                                field: 'image',
                                                file: null,
                                                originalName: item.name,
                                            })
                                        }
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden-file-input"
                                        onChange={(e) =>
                                            handleImageChange(catIndex, itemIndex, e.target.files[0])
                                        }
                                    />
                                </label>

                                <div className="edit-fields">
                                    <div>
                                    <span> <strong>Nombre actualizado: {item.name}</strong></span>
                                        <i
                                            className="fas fa-pencil-alt edit-icon"
                                            onClick={() => handleEditClick(catIndex, itemIndex, 'name', item.name)}
                                            title="Editar nombre"
                                        ></i>
                                    </div>
                                    <div>
                                        <span>Descripción actualizada: {item.description}</span>
                                        <i
                                            className="fas fa-pencil-alt edit-icon"
                                            onClick={() => handleEditClick(catIndex, itemIndex, 'description', item.description)}
                                            title="Editar descripción"
                                        ></i>
                                    </div>
                                    <div>
                                        <span>Precio actualizado: ${item.price}</span>
                                        <i
                                            className="fas fa-pencil-alt edit-icon"
                                            onClick={() => handleEditClick(catIndex, itemIndex, 'price', item.price)}
                                            title="Editar precio"
                                        ></i>
                                    </div>
                                    <i
                                        className="fas fa-trash-alt delete-icon"
                                        onClick={() => openDeleteModal(catIndex, itemIndex)}
                                    ></i>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        ))}

        <Modal
            isOpen={isModalOpen}
            message="¿Estás seguro de que deseas eliminar este plato?"
            onConfirm={handleDelete}
            onCancel={() => setIsModalOpen(false)}
        />
    </div>
);

};

export default EditDishes;
