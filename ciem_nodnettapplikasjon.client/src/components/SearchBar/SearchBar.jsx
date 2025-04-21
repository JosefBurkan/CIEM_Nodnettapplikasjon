import React, { useState, useMemo, useRef, useEffect } from 'react';
import { IconSearch, IconMenu2 } from '@tabler/icons-react';
import styles from './SearchBar.module.css';

function SearchBar({
  placeholder = 'Søk...',
  bgColor = '#4F4F4F',
  width = '18rem',
  onSearch = () => {},
  onSelectActor = () => {},
  actors = [],
  enableDropdown = false,
  fetchActors = false,
  searchBarMode = '', // e.g. 'Actors' or 'NetworkSearch'
}) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [internalActors, setInternalActors] = useState([]);
  const containerRef = useRef(null);

  // Fetch actors from API if needed
  useEffect(() => {
    if (fetchActors) {
      (async () => {
        try {
          const res = await fetch('/api/actors');
          if (!res.ok) throw new Error('Network response was not ok');
          const data = await res.json();
          setInternalActors(data);
        } catch (err) {
          console.error('Failed to fetch actors', err);
        }
      })();
    }
  }, [fetchActors]);

  // Determine source list: prop or fetched
  const actorList = actors.length > 0 ? actors : internalActors;

  // Filter actors based on query
  const filteredActors = useMemo(() => {
    if (!enableDropdown || !query) return [];
    return actorList.filter(actor =>
      actor.name?.toLowerCase().includes(query.toLowerCase())
    );
  }, [enableDropdown, query, actorList]);

  // Handle input change
  const handleChange = e => {
    const val = e.target.value;
    setQuery(val);
    if (enableDropdown) setShowDropdown(true);
    onSearch(val);
  };

  // Handle Enter key
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActors.length > 0) {
        handleItemClick(filteredActors[0]);
      } else {
        setShowDropdown(false);
      }
    }
  };

  // Default select: invoke onSelectActor
  const handleSelect = actor => {
    setQuery(actor.name);
    setShowDropdown(false);
    onSelectActor(actor);
  };

  // Decide click action based on mode
  const handleItemClick = actor => {
    if (searchBarMode === 'Actors') {
      setQuery(actor.name);
      setShowDropdown(false);
      // use onSearch to send back selected actor ID
      const id = actor.id ?? actor.nodeID;
      onSearch(id);
    } else {
      handleSelect(actor);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const onClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.searchContainer}
      style={{ backgroundColor: bgColor, width, position: 'relative' }}
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
          onFocus={() => enableDropdown && setShowDropdown(true)}
        />
        <IconMenu2 className={styles.menuIcon} />
      </div>

      {enableDropdown && showDropdown && filteredActors.length > 0 && (
        <ul className={styles.dropdown}>
          {filteredActors.map(actor => (
            <li
              key={actor.id ?? actor.nodeID}
              className={styles.dropdownItem}
              onClick={() => handleItemClick(actor)}
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
