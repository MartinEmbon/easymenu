import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import MenuCategory from './MenuCategory';
import SearchBar from './SearchBar';
import Header from './Header';
import Footer from './Footer.';

import '../styles.css';

const suggestions = [
  {
    name: "Ravioles de ricota",
    description: "Con salsa fileto casera",
    price: 1900,
    image: "https://source.unsplash.com/400x300/?ravioli"
  },
  {
    name: "Tabla de quesos",
    description: "Selección de quesos locales",
    price: 2200,
    image: "https://source.unsplash.com/400x300/?cheese"
  }
];

const PublicMenu = () => {
  const { clienteId } = useParams(); // e.g. user@email.com
  const [searchTerm, setSearchTerm] = useState("");
  const [menuItems, setMenuItems] = useState([]); // ← dynamic menu from backend
  const email = localStorage.getItem("userEmail");
console.log(email)


useEffect(() => {
  const fetchMenu = async () => {
    try {
      const response = await axios.get(
        "https://list-dishes-336444799661.us-central1.run.app",
        {
          params: { clienteId }
        }
      );

      console.log("🔥 Menu response:", response.data);
      setMenuItems(response.data.categories || []);
    } catch (err) {
      console.error("Error fetching menu:", err);
    }
  };

  fetchMenu();
}, [clienteId]);


// useEffect(() => {
//   const fetchMenu = async () => {
//     try {
//       const email = localStorage.getItem("userEmail");

//       if (!email) {
//         console.error("❗ Email not found in localStorage");
//         return;
//       }

//       const response = await axios.get(
//         "https://list-dishes-336444799661.us-central1.run.app",
//         {
//           params: { email }
//         }
//       );

//       console.log("🔥 Menu response:", response.data);
//       setMenuItems(response.data.categories  || []);
//     } catch (err) {
//       console.error("Error fetching menu:", err);
//     }
//   };

//   fetchMenu();
// }, [clienteId]);

  // Optional: you could group items by category if needed
  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const regularCategories = menuItems.filter(cat => !cat.isSuggestion);
  const suggestedCategories = menuItems.filter(cat => cat.isSuggestion);
  
  return (
    <>
      <Header />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="menu-container">
      {/* <h1 className="menu-title">Carta de Platos de {clienteId}</h1> */}

  <h1 className="menu-title">Carta de Platos</h1>
  {menuItems.map((category, i) => (
    <div key={i}>
      <h2>{category.name}</h2> {/* Optional if your category has a name */}
      {category.items.map((item, j) => (
  <div key={j} className="menu-item">
    {item.image && (
      <img src={item.image} alt={item.name || 'Imagen del plato'} />
    )}
    <div className="item-info">
      <h4>{item.name}</h4>
      <p>{item.description}</p>
    </div>
    <p className="price">${item.price}</p>
  </div>
))}
    </div>
  ))}
</div>
{/* 
      <div className="menu-container">
        <h1 className="menu-title">Sugerencias</h1>
        {suggestions.map((item, i) => (
          <div key={i} className="menu-item">
            <img src={item.image} alt={item.name} />
            <div className="item-info">
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <p className="price">${item.price}</p>
            </div>
          </div>
        ))}
      </div> */}


{suggestedCategories.length > 0 && (
      <div className="menu-container">
        <h1 className="menu-title">✨ Sugerencias del Chef</h1>
        {suggestedCategories.map((category, i) => (
          <div key={i}>
            <h2>{category.name}</h2>
            {category.items.map((item, j) => (
              <div key={j} className="menu-item suggestion-highlight">
                {item.image && (
                  <img src={item.image} alt={item.name || 'Imagen del plato'} />
                )}
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                </div>
                <p className="price">${item.price}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    )}


      <Footer />
    </>
  );
};

export default PublicMenu;

// const mockData = [
//   {
//     name: "Entradas",
//     items: [
//       {
//         name: "Empanadas Salteñas",
//         description: "Carne cortada a cuchillo, especias norteñas",
//         price: 800,
//         image: "https://source.unsplash.com/400x300/?empanada"
//       },
//       {
//         name: "Provoleta",
//         description: "Queso provolone a la parrilla con orégano",
//         price: 1200,
//         image: "https://source.unsplash.com/400x300/?provoleta"
//       }
//     ]
//   },
//   {
//     name: "Platos Principales",
//     items: [
//       {
//         name: "Asado criollo",
//         description: "Corte argentino, papas rústicas",
//         price: 2500,
//         image: "https://source.unsplash.com/400x300/?asado"
//       }
//     ]
//   }
// ];

// const suggestions = [
//   {
//     name: "Ravioles de ricota",
//     description: "Con salsa fileto casera",
//     price: 1900,
//     image: "https://source.unsplash.com/400x300/?ravioli"
//   },
//   {
//     name: "Tabla de quesos",
//     description: "Selección de quesos locales",
//     price: 2200,
//     image: "https://source.unsplash.com/400x300/?cheese"
//   }
// ];

// const menuPorCliente = {
//   restoDonJulio: ['Empanadas', 'Milanesa', 'Flan con dulce'],
//   parrillaDonPepe: ['Chorizo', 'Asado', 'Ensalada criolla'],
// };