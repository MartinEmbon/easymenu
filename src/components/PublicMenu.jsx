import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import MenuCategory from './MenuCategory';
import SearchBar from './SearchBar';
import Header from './Header';
import Footer from './Footer.';
import { useGeneralInfo } from '../hooks/useGeneralInfo';
import { Helmet } from 'react-helmet'; // Import Helmet

import '../styles.css';

const PublicMenu = () => {
  const { clienteId } = useParams(); // e.g. user@email.com
  const [searchTerm, setSearchTerm] = useState("");
  const [menuItems, setMenuItems] = useState([]); // ← dynamic menu from backend
  const email = localStorage.getItem("userEmail");
  const [expandedCategories, setExpandedCategories] = useState({}); // Track expanded state per category
  const [expandedCategory, setExpandedCategory] = useState(null);
  const { generalInfo, loading, error } = useGeneralInfo(clienteId); // Fetch general info including logo

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

  useEffect(() => {
        if (generalInfo?.profilePictureUrl) {
          updateFavicon(generalInfo.profilePictureUrl);
        }
      }, [generalInfo?.profilePictureUrl]);


    const updateFavicon = (faviconUrl) => {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = faviconUrl;
        };


  // const toggleCategory = (categoryId) => {
  //   setExpandedCategories(prevState => ({
  //     ...prevState,
  //     [categoryId]: !prevState[categoryId], // Toggle the selected category
  //   }));
  // };
  const toggleCategory = (key) => {
    setExpandedCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Optional: you could group items by category if needed
  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const regularCategories = menuItems.filter(cat => !cat.isSuggestion);
  const suggestedCategories = menuItems.filter(cat => cat.isSuggestion);
  console.log(generalInfo)
  console.log(generalInfo.profilePictureUrl)

  return (
    <>
      {/* <Helmet>
        <meta property="og:title" content="Mirá la carta de nuestro restaurante" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:description" content="¡Te va a encantar esta carta digital!" />
        {generalInfo.profilePictureUrl && (
          <meta property="og:image" content={generalInfo.profilePictureUrl} />
        )}
        <meta property="og:image:alt" content="Logo del restaurante" />
        <meta property="og:image:type" content="image/png" />
      </Helmet> */}
      <Header />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="menu-container">
        <h1 className="menu-title">Carta de Platos</h1>
        {menuItems
          .filter(category => !category.suggestion && category.visible)
          .map((category, i) => {
            const key = category.id || `cat-${i}`; // fallback
            return (
              <div key={key} className="menu-category">
                <button
                  className={`accordion-button ${expandedCategories[key] ? 'expanded' : 'collapsed'}`}
                  onClick={() => toggleCategory(key)}
                >
                  <h2>{category.name}</h2>
                  <span className={`accordion-icon ${expandedCategories[key] ? 'expanded' : 'collapsed'}`}>
                    {expandedCategories[key] ? '▲' : '▼'}
                  </span>
                </button>

                <div className={`category-dishes ${expandedCategories[key] ? 'expanded' : ''}`}>
                  {category.items
                                        .filter(item => item.visible !== false) // ← this hides dishes with visible: false or undefined

                  .map((item, j) => (
                    <div key={j} className="menu-item">
                      {item.image && <img src={item.image} alt={item.name || 'Imagen del plato'} />}
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>{item.description}</p>
                      </div>
                      <p className="price">${item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>

      {menuItems.some(cat => cat.suggestion) && (
        <div className="menu-container">
          <h1 className="menu-title">Especiales</h1>
          {menuItems
            .filter(category => category.suggestion && category.visible) // Suggestion categories
            .map((category, i) => {
              const key = category.id || `suggestion-${i}`; // Usamos ID si existe, si no, un fallback único
              return (
                <div key={key} className="menu-category">
                  <button
                    className={`accordion-button ${expandedCategories[key] ? 'expanded' : 'collapsed'}`}
                    onClick={() => toggleCategory(key)}
                  >
                    <h2>{category.name}</h2>
                    <span className={`accordion-icon ${expandedCategories[key] ? 'expanded' : 'collapsed'}`}>
                      {expandedCategories[key] ? '▲' : '▼'}
                    </span>
                  </button>

                  <div className={`category-dishes ${expandedCategories[key] ? 'expanded' : ''}`}>
                    {category.items
                      .filter(item => item.visible !== false) // ← this hides dishes with visible: false or undefined

                    .map((item, j) => (
                      <div key={j} className="menu-item">
                        {item.image && <img src={item.image} alt={item.name || 'Imagen del plato'} />}
                        <div className="item-info">
                          <h4>{item.name}</h4>
                          <p>{item.description}</p>
                        </div>
                        <p className="price">${item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <Footer />
    </>
  );

};

export default PublicMenu;
