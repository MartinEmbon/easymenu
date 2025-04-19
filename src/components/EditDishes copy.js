import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const EditDishes = ({ email }) => {
  const [categories, setCategories] = useState([]);
  const { clienteId } = useParams(); // e.g. user@email.com

  useEffect(() => {
    const fetchCategories = async () => {
      if (!email) return;
      const res = await axios.get("https://list-dishes-336444799661.us-central1.run.app", {
        params: { clienteId }
      });
      setCategories(res.data.categories || []);
    };
    fetchCategories();
  }, [email]);

  return (
    <div className="dish-form-container">
      <h2 className="form-title">Editar / Eliminar Platos</h2>
      {categories.map((cat, i) => (
        <div key={i} style={{ marginBottom: '16px' }}>
          <h4>{cat.name}</h4>
          {(cat.items || []).map((item, idx) => (
            <div key={idx} className="item-form">
              <strong>{item.name}</strong>: {item.description} - ${item.price}
              <br />
              <img src={item.image} alt={item.name} style={{ height: 60 }} />
              {/* Add edit/remove buttons here */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default EditDishes;
