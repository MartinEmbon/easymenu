import React, { useState } from "react";
import axios from "axios";

const MenuInput = () => {
  const [sectionName, setSectionName] = useState("");
  const [items, setItems] = useState([{ name: "", description: "", price: "", image: "" }]);

  const email = localStorage.getItem("userEmail"); // or from Redux

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", description: "", price: "", image: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const menuSection = {
      name: sectionName,
      items: items.map(item => ({
        ...item,
        price: parseInt(item.price, 10)
      }))
    };

    try {
      const response = await axios.post(
        "https://REGION-PROJECT.cloudfunctions.net/createMenu", // replace with your deployed Cloud Function URL
        {
          email,
          menuSection
        }
      );
      alert("Menu saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving menu");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear nueva sección del menú</h2>
      <input
        placeholder="Nombre de la sección (ej. Entradas)"
        value={sectionName}
        onChange={(e) => setSectionName(e.target.value)}
        required
      />
      {items.map((item, idx) => (
        <div key={idx}>
          <input
            placeholder="Nombre del plato"
            value={item.name}
            onChange={(e) => handleItemChange(idx, "name", e.target.value)}
            required
          />
          <input
            placeholder="Descripción"
            value={item.description}
            onChange={(e) => handleItemChange(idx, "description", e.target.value)}
          />
          <input
            type="number"
            placeholder="Precio"
            value={item.price}
            onChange={(e) => handleItemChange(idx, "price", e.target.value)}
            required
          />
          <input
            placeholder="URL de la imagen"
            value={item.image}
            onChange={(e) => handleItemChange(idx, "image", e.target.value)}
          />
        </div>
      ))}
      <button type="button" onClick={addItem}>Agregar otro plato</button>
      <button type="submit">Guardar menú</button>
    </form>
  );
};

export default MenuInput;
