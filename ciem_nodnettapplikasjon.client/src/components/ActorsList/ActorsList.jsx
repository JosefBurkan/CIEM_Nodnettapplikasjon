import React, { useState, useEffect } from 'react';
import "../../index.css";
import styles from './ActorsList.module.css';
import SearchBar from '../SearchBar/SearchBar';
import { IconMail, IconUser } from '@tabler/icons-react';
import { createClient } from '@supabase/supabase-js';

    // Create the Supabase client instance
    const supabase = createClient(
        'https://vigjqzuqrnxapqxhkwds.supabase.co/',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZ2pxenVxcm54YXBxeGhrd2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NzU2MjksImV4cCI6MjA1NzM1MTYyOX0.4vS7Yh-dgCEDacxGL8lz4Zp47lq28Xa3lfWV8NsiNyM'
    );

function ActorsList({ category }) {
    // Use the category prop as initial filter if provided, default to "Alle"
    const [actors, setActors] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState(category || "Alle");
    const [typeFilter, setTypeFilter] = useState("Alle"); 
    const [dropdown, setDropdown] = useState({});
    const [tempSelectedActors, setTempSelectedActors] = useState([]);


    // Fetch the actor data
    const fetchActors = async () => {
        const response = await fetch("https://ciem-nodnettapplikasjon.onrender.com/api/actor")
        const data = await response.json();
        setActors(data);
    } 

    // Fetch actor data from the API when the component mounts
    useEffect(() => {
        fetchActors();

        // Listen to database changes, update on INSERT, UPDATE, DELETE 
        supabase
        .channel('table-db-changes')
        .on('postgres_changes',
    {
        event: '*',
        schema: 'public',
        table: 'Actors',
    },
    (payload) => {
        fetchActors();
      }
    )
    .subscribe(status => console.log(status))
    }, []);

    // Filter actors by category, actor type, and search text
    const filteredActors = actors.filter(actor => {
        // Compare category values (using trim and lowercase)
        const matchesCategory =
            categoryFilter === "Alle" ||
            (actor.category &&
                actor.category.trim().toLowerCase() === categoryFilter.toLowerCase());
        // Compare actor type (using trim and lowercase)
        const matchesType =
            typeFilter === "Alle" ||
            (actor.actorType &&
                actor.actorType.trim().toLowerCase() === typeFilter.toLowerCase());
        // Check search text (matches name or any subactor)
        const matchesSearch =
            actor.name.toLowerCase().includes(search.toLowerCase()) ||
            (actor.subActors &&
                actor.subActors.some(sub => sub.toLowerCase().includes(search.toLowerCase())));
        return matchesCategory && matchesType && matchesSearch;
    });

    // Toggle dropdown visibility for an actor
    const toggleDropdown = (actorName) => {
        setDropdown(prev => ({
            ...prev,
            [actorName]: !prev[actorName]
        }));
    };

    // Toggle temporary selection of an actor
    const toggleTempSelectedActor = (actorName) => {
        setTempSelectedActors(prev =>
            prev.includes(actorName)
                ? prev.filter(name => name !== actorName)
                : [...prev, actorName]
        );
    };

    return (
        <div className={styles.x}>
            {/* Top Section: Search and filter controls */}
            <div className={styles.topSection}>
                <div className={styles.btnContainer}>
                    <button className={styles.midlertidigBtn}>List format</button>
                    <button className={styles.midlertidigBtn}>Nettverk format</button>
                </div>
                <div className={styles.searchBarContainer}>
                    <SearchBar
                        placeholder="Search actors..."
                        bgColor="#1A1A1A"
                        onSearch={setSearch}
                    />
                </div>
                <div className={styles.filterBtnContainer}>
                    <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                        <option value="Alle">Alle</option>
                        <option value="Statlige">Statlige</option>
                        <option value="Private">Private</option>
                        <option value="Frivillige">Frivillige</option>
                    </select>
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                        <option value="Alle">Alle</option>
                        <option value="Person">Person</option>
                        <option value="Organisasjon">Organisasjon</option>
                    </select>
                </div>
                <button>
                    <IconMail className={styles.mailIcon} />
                </button>
                <button>
                    <IconUser className={styles.userIcon} />
                </button>
            </div>

            {/* Header Box: Display the selected filters */}
            <div className={styles.headerBoxContainer}>
                <div className={styles.headerBox}>
                    <IconUser className={styles.headerIcon} />
                    <span>
                        {`${categoryFilter} Aktører`}
                        {typeFilter !== "Alle" && ` / ${typeFilter}`}
                    </span>
                </div>
            </div>

            {/* Content Container: Display the list of filtered actors */}
            <div className={styles.contentContainer}>
                <ul className={styles.actorsList}>
                    {filteredActors.map(actor => (
                        <li key={actor.id} className={styles.actorItem}>
                            <div className={styles.actorListContainer}>
                                <input
                                    className={styles.actorCheckbox}
                                    type="checkbox"
                                    checked={tempSelectedActors.includes(actor.name)}
                                    onChange={() => toggleTempSelectedActor(actor.name)}
                                />
                                <button
                                    className={`${styles.actorBtn} ${dropdown[actor.name] ? styles.activeDropdown : ''}`}
                                    onClick={() => toggleDropdown(actor.name)}
                                >
                                    {actor.name}
                                    <span className={`${styles.arrow} ${dropdown[actor.name] ? styles.activeArrow : ''}`}>
                                        {dropdown[actor.name] ? " ▲" : " ▼"}
                                    </span>
                                </button>
                            </div>
                            {dropdown[actor.name] && actor.subActors && actor.subActors.length > 0 && (
                                <ul className={styles.subActors}>
                                    {actor.subActors.map((sub, index) => (
                                        <li key={index} className={styles.subActor}>{sub}</li>
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
