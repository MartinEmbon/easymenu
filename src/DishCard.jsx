const DishCard = ({ dish }) => (
    <div className="dish-card">
      <div className="dish-header">
        <h4>{dish.name}</h4>
        <span className="price">{dish.price}</span>
      </div>
      <p className="dish-description">{dish.description}</p>
    </div>
  );
  
  export default DishCard;
  