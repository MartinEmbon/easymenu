import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from './Modal';  // Import the modal component
import { useOutletContext } from 'react-router-dom';
import SearchBar from './SearchBar';
import { ReactSortable } from "react-sortablejs";

import "../EditDish.css"
const EditDishes = () => {
    const [categories, setCategories] = useState([]);
    const [editableItem, setEditableItem] = useState(null);  // To track the dish being edited
    // const { clienteId } = useParams(); // e.g. user@email.com
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); // To track which item to delete
    const { email } = useOutletContext();        // ✅ get email from context
    const { clienteId } = useParams();           // ✅ get clienteId from URL params
    const [searchTerm, setSearchTerm] = useState('');
    const [newOrder, sestNewOrder] = useState('');
    const [categoryName, setNewCategoryName] = useState('');


    useEffect(() => {
        const fetchCategories = async () => {
            if (!email) return;
            const res = await axios.get("https://list-dishes-336444799661.us-central1.run.app", {
                params: { clienteId }
            });
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

    const handleRemoveImage = async (catIndex, itemIndex) => {
        try {
            const updatedCategories = [...categories];
            updatedCategories[catIndex].items[itemIndex].image = "";
            setCategories(updatedCategories);

            await axios.put("https://update-dish-336444799661.us-central1.run.app", {
                clienteId,
                categoryName: updatedCategories[catIndex].name,
                itemId: categories[catIndex].items[itemIndex].name,
                field: 'image',
                value: "", // Clear the image on the backend
            });

            console.log("✅ Imagen eliminada correctamente");
        } catch (error) {
            console.error("❌ Error al eliminar imagen:", error);
            alert("No se pudo quitar la imagen.");
        }
    };

    const saveNewOrder = async () => {
        if (!categoryName || !newOrder || newOrder.length === 0) return;
    
        try {
          // 1. Call your Cloud Function to update the order
          await axios.post(
            "https://reorder-dishes-336444799661.us-central1.run.app",
            {
              clienteId: clienteId,
              categoryName: categoryName,
              newOrder: newOrder.map(item => ({
                id: item.id,
                name: item.name,
              })),
            }
          );
    
          // Optional: Success message to user
        
        } catch (error) {
          console.error("Error saving new order:", error);
         
        }
      };
      
      
    return (
        <div className="dish-form-container">
            <h2 className="form-title">Editar / Eliminar Platos</h2>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    
            {categories.map((cat, catIndex) => {
                const filteredItems = (cat.items || []).filter(item =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchTerm.toLowerCase())
                );
    
                return (
                    <div key={catIndex} className="category-section">
                        <h4 className="category-title">{cat.name}</h4>
    
                        <ReactSortable
                            list={cat.items}
                            setList={(newState) => {
                                const updatedCategories = [...categories];
                                updatedCategories[catIndex].items = newState;
                                setCategories(updatedCategories);
                                saveNewOrder(catIndex, newState); // ⬅️ save the new order
                            }}
                            animation={200}
                            handle=".drag-handle"
                        >
                            {filteredItems.map((item, itemIndex) => (
                                <div key={item.id || itemIndex} className="item-form">
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
                                            <div className="drag-handle" style={{ cursor: 'grab' }}>☰</div> {/* <-- Drag handle */}
                                            <p className="item-preview">
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
                                                <button
                                                    type="button"
                                                    className="remove-image-button"
                                                    onClick={() => handleRemoveImage(catIndex, itemIndex)}
                                                >
                                                    Quitar imagen
                                                </button>
                                            </label>
    
                                            <div className="edit-fields">
                                                <div>
                                                    <span><strong>Nombre actualizado: {item.name}</strong></span>
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
                        </ReactSortable>
    
                        <Modal
                            isOpen={isModalOpen}
                            message="¿Estás seguro de que deseas eliminar este plato?"
                            onConfirm={handleDelete}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                );
            })}
        </div>
    );
    
  
};

export default EditDishes;
