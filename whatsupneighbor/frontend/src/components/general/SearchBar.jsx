import { useState } from "react";

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!query.trim()) return;

        if (onSearch) {
            onSearch(query);
        }

        setQuery("");
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
                />
                <button type="submit">Search</button>
        </form>
    )
}

export default SearchBar;