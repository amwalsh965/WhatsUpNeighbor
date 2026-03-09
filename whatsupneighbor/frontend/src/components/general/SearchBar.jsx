import { useMemo, useState, useEffect, useRef } from "react";

function SearchBar({
  models = ["items"],
  outline = false,
  width = "100%",
  minLength = 2,
  debounceDelay = 500,
  onResults,
  placeholder = "Search...",
}) {
  const stableModels = useMemo(() => models, [models.join(",")]);

  const token = localStorage.getItem("accessToken");

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const controllerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [query, debounceDelay]);

  useEffect(() => {

    if (debouncedQuery.length < minLength) {
      if (onResults) onResults(null);
      return;
    }

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    async function fetchResults() {

      try {

        const res = await fetch(
          `http://127.0.0.1:8000/main/search/?search=${encodeURIComponent(debouncedQuery)}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            }
        );

        const data = await res.json();

        if (onResults) onResults(data.results);

      } catch (err) {

        if (err.name !== "AbortError") {
          console.error("Search error:", err);
        }

      }
    }

    fetchResults();

  }, [debouncedQuery, minLength, stableModels]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={placeholder}
      className="event-search"
      style={{
        width,
        outline: outline ? "2px solid #4A90E2" : "none",
      }}
    />
  );
}

export default SearchBar;