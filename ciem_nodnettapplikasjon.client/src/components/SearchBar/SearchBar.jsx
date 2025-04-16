import React, { useState, useMemo, useRef, useEffect } from "react";
import { IconSearch, IconMenu2 } from "@tabler/icons-react";
import styles from "./SearchBar.module.css";

function SearchBar({
  placeholder = "Søk...",
  bgColor = "#4F4F4F",
  width = "18rem",
  onSearch = () => {},
  onSelectActor = () => {},
  // Dersom en liste med aktører sendes inn, brukes denne.
  // Om ikke, og fetchActors er true, hentes aktører direkte fra databasen.
  actors = [],
  enableDropdown = false,
  // Ny prop for å indikere om aktører skal hentes fra API-databasen
  fetchActors = false,
}) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [internalActors, setInternalActors] = useState([]);
  const containerRef = useRef(null);

  // Hvis fetchActors er true, hentes aktører fra API-et (for eksempel '/api/actors')
  useEffect(() => {
    if (fetchActors) {
      async function fetchFromDb() {
        try {
          const response = await fetch("/api/actors"); // Pass på at URL-en stemmer med ditt oppsett
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setInternalActors(data);
        } catch (error) {
          console.error("Failed to fetch actors", error);
        }
      }
      fetchFromDb();
    }
  }, [fetchActors]);

  // Bruk den sendte inn actor-lista dersom den finnes, ellers den vi har hentet internt
  const actorList = actors && actors.length > 0 ? actors : internalActors;

  // Filter aktører basert på søkeordet dersom enableDropdown er aktivert
  const filteredActors = useMemo(() => {
    if (!enableDropdown || !query) return [];
    return actorList.filter((actor) =>
      actor.name?.toLowerCase().includes(query.toLowerCase())
    );
  }, [enableDropdown, query, actorList]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (enableDropdown) setShowDropdown(true);
    onSearch(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredActors.length > 0) {
        handleSelect(filteredActors[0]);
      } else {
        setShowDropdown(false);
      }
    }
  };

  const handleSelect = (actor) => {
    setQuery(actor.name);
    setShowDropdown(false);
    console.log("Selected actor:", actor);
    onSelectActor(actor);
  };

  // Lukker dropdown ved klikk utenfor komponenten
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.searchContainer}
      style={{ backgroundColor: bgColor, width, position: "relative" }}
    >
      <div className={styles.searchBar}>
        <IconSearch className={styles.iconSearch} />
        <input
          type="text"
          placeholder={placeholder}
          className={styles.searchInput}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (enableDropdown) setShowDropdown(true);
          }}
        />
        <IconMenu2 className={styles.menuIcon} />
      </div>
      {enableDropdown && showDropdown && filteredActors.length > 0 && (
        <ul className={styles.dropdown}>
          {filteredActors.map((actor) => (
            <li
              key={actor.nodeID || actor.id}
              className={styles.dropdownItem}
              onClick={() => handleSelect(actor)}
            >
              {actor.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
