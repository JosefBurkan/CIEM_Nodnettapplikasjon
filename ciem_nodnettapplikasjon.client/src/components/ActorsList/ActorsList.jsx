import React, { useState, useEffect } from 'react';
import '../../index.css';
import styles from './ActorsList.module.css';
import SearchBar from '../SearchBar/SearchBar';
import { IconUser } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';

function ActorsList({ category }) {

    const [actors, setActors] = useState([]); // State to store all actors fetched from the API
    const [search, setSearch] = useState(''); // State to store the search query
    const [categoryFilter, setCategoryFilter] = useState(category || 'Alle'); // State for the selected category filter (default to prop or 'Alle')
    const [typeFilter, setTypeFilter] = useState('Alle'); // State for the selected type filter
    const [dropdown, setDropdown] = useState({}); // State to track which dropdown menus are open (by actor name)
    const [tempSelectedActors, setTempSelectedActors] = useState([]); // Temporary state for actors selected via checkboxes
    // Function to fetch actors from the API
    const fetchActors = async () => {
        const response = await fetch('https://ciem-nodnettapplikasjon.onrender.com/api/actor');
        const data = await response.json();
        setActors(data);
    };

// Initial fetch of actors when the component mounts. Subscribes to changes.
    useEffect(() => {
        fetchActors();
        supabase
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'Actors',
                },
                (payload) => {
                    fetchActors(); // Fetch actors again when there are changes in the 'Actors' table
                }
            )
            .subscribe();
    }, []);

    // Filter actors based on filters and search query
    const filteredActors = actors.filter((actor) => {
        const matchesCategory =
            categoryFilter === 'Alle' ||
            (actor.category &&
                actor.category.trim().toLowerCase() ===
                    categoryFilter.toLowerCase());
        const matchesType =
            typeFilter === 'Alle' ||
            (actor.actorType &&
                actor.actorType.trim().toLowerCase() ===
                    typeFilter.toLowerCase());
        const matchesSearch =
            actor.name.toLowerCase().includes(search.toLowerCase()) ||
            (actor.subActors &&
                actor.subActors.some((sub) =>
                    sub.toLowerCase().includes(search.toLowerCase())
                ));
        return matchesCategory && matchesType && matchesSearch;
    });

    // Toggle dropdown for sub-actors
    const toggleDropdown = (actorName) => {
        setDropdown((prev) => ({
            ...prev,
            [actorName]: !prev[actorName],
        }));
    };

    // Toggle temporary selection of actors via checkboxes
    const toggleTempSelectedActor = (actorName) => {
        setTempSelectedActors((prev) =>
            prev.includes(actorName)
                ? prev.filter((name) => name !== actorName)
                : [...prev, actorName]
        );
    };

    return (
        <div className={styles.container}>
            {/* Top section with search bar, filters, and header */}
            <div className={styles.topSection}>
                <div className={styles.searchBarContainer}>
                    <SearchBar
                        placeholder="Search actors..."
                        bgColor="#1A1A1A"
                        onSearch={setSearch}
                    />
                </div>
                <div className={styles.filterBtnContainer}>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="Alle">Alle</option>
                        <option value="Statlige">Statlige</option>
                        <option value="Private">Private</option>
                        <option value="Frivillige">Frivillige</option>
                    </select>
                    <select
                        className={styles.filterSelect}
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="Alle">Alle</option>
                        <option value="Person">Person</option>
                        <option value="Organisasjon">Organisasjon</option>
                    </select>
                </div>

                <div className={styles.headerBoxContainer}>
                    <div className={styles.headerBox}>
                        <IconUser className={styles.headerIcon} />
                        <span>
                            {`${categoryFilter} Aktører`}
                            {typeFilter !== 'Alle' && ` / ${typeFilter}`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actor list */}
            <div className={styles.contentContainer}>
                <ul className={styles.actorsList}>
                    {filteredActors.map((actor) => (
                        <li key={actor.id} className={styles.actorItem}>
                            <div className={styles.actorListContainer}>
                                <input
                                    className={styles.actorCheckbox}
                                    type="checkbox"
                                    checked={tempSelectedActors.includes(
                                        actor.name
                                    )}
                                    onChange={() =>
                                        toggleTempSelectedActor(actor.name)
                                    }
                                />
                                <Link
                                    to={`/actor/${actor.id}`}
                                    className={styles.actorBtn}
                                >
                                    {actor.name}
                                </Link>
                                <span
                                    className={`${styles.arrow} ${dropdown[actor.name] ? styles.activeArrow : ''}`}
                                    onClick={() => toggleDropdown(actor.name)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {dropdown[actor.name] ? '▲' : '▼'}
                                </span>
                            </div>
                            {dropdown[actor.name] &&
                                actor.subActors &&
                                actor.subActors.length > 0 && (
                                    <ul className={styles.subActors}>
                                        {actor.subActors &&
                                            actor.subActors
                                            .toString()
                                            .split(',')
                                            .map((sub, index) => (
                                        <li key={index} className={styles.subActor}>
                                            {sub.trim()}
                                        </li>
                                        ))}
                                    </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ActorsList;
