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
}) {
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef(null);

    // Filter aktører basert på query dersom enableDropdown er true.
    const filteredActors = useMemo(() => {
        if (!enableDropdown || !query) return [];
        return actors.filter((actor) =>
            actor.name?.toLowerCase().includes(query.toLowerCase())
        );
    }, [enableDropdown, query, actors]);

    const handleChange = (e) => {
        setQuery(e.target.value);
        if (enableDropdown) {
            setShowDropdown(true);
        }
        onSearch(e.target.value);
    };

    // Ved Enter-tast, velg første match om den finnes.
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
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
        // Debug: log for å se hva som sendes
        console.log('Selected actor:', actor);
        onSelectActor(actor);
    };

    // Lukk dropdown hvis man klikker utenfor komponenten.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
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
                            key={actor.nodeID}
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
