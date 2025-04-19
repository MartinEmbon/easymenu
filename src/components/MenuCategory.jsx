import { useState } from 'react';
import DishCard from '../DishCard';

const MenuCategory = ({ category }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="menu-category">
      <button className="category-toggle" onClick={() => setOpen(!open)}>
        <span>{category.name}</span>
        <span className={`arrow ${open ? 'open' : ''}`}>▾</span>
      </button>

      <div className={`category-dishes ${open ? 'expanded' : ''}`}>
      {category.items.map((item, index) => (
          <div key={index} className="menu-item">
            <img src={item.image} alt={item.name} />
            <div className="item-info">
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <p className="price">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCategory;
