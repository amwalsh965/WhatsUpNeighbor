import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/general/SearchBar";

export default function SavedScreen() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchResults = useCallback((results) => {
    setSearchResults(results || []);
  }, []);

  useEffect(() => {
  async function checkAuth() {
    const res = await fetch("http://127.0.0.1:8000/main/current_user/", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            });
    const data = await res.json();
    if (!data.authenticated) navigate("/auth");
  }
  // checkAuth();
}, [navigate]);

  useEffect(() => {
    async function fetchSaved() {
      try {
        const res = await fetch("http://127.0.0.1:8000/main/saved/", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            });
        const data = await res.json();
        setItems(data.results);
        setSearchResults(data.results);
      } catch (err) {
        console.error("Error fetching saved items:", err);
      }
    }

    fetchSaved();
  }, []);

  const filteredItems = searchResults;

  return (
    <div className="saved-screen">
      <h1>Saved Items</h1>

      <SearchBar
        placeholder="Search saved items..."
        models={["items"]}
        outline={true}
        onResults={(results) => {
          if (!results) {
            setSearchResults(items);
          } else {
            setSearchResults(results);
          }
        }}
      />

      {filteredItems.length === 0 ? (
        <div>No saved items found</div>
      ) : (
        <div className="saved-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="listing-card">
              <img src={item.image} alt={item.name} />
              <div>{item.name}</div>
              <div>{item.category}</div>
              <div>{item.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}