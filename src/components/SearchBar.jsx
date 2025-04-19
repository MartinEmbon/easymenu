const SearchBar = ({ searchTerm, setSearchTerm }) => (
    <div className="search-bar">
      <input
        type="text"
        placeholder="🔎 Buscar platos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
  
  export default SearchBar;
  