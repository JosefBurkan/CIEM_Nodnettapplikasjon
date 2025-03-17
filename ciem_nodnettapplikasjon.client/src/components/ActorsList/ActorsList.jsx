import React, { useState, useEffect } from 'react';
import "../../index.css";
import styles from './ActorsList.module.css';
import SearchBar from '../../components/SearchBar/SearchBar';

function ActorsList() {
    const [actors, setActors] = useState([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("All");

    useEffect(() => {
        // Fetch data from your API and update state
        fetch("https://localhost:5255/api/actor")
            .then(response => response.json())
            .then(data => setActors(data))
            .catch(error => console.error("Error fetching actors:", error));
    }, []);

    // Filter actors based on the search input and filter type
    const filteredActors = actors.filter(actor => {
        const matchesSearch = actor.name.toLowerCase().includes(search.toLowerCase());
        const matchesType =
            filterType === "All" ||
            (actor.actorType && actor.actorType.toLowerCase() === filterType.toLowerCase());
        return matchesSearch && matchesType;
    });

    return (
        <div className={styles.x}>
            <div className={styles.filtercontainer}>
                <SearchBar
                    placeholder="Search actors..."
                    bgColor="#1A1A1A"
                    onSearch={setSearch}
                />
                <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="All">All</option>
                    <option value="human">Human</option>
                    <option value="company">Company</option>
                </select>
            </div>
            <ul className={styles.actorsList}>
                {filteredActors.map(actor => (
                    <li key={actor.id} className={styles.actorItem}>
                        <h3>{actor.name}</h3>
                        {actor.actorType && <p>Type: {actor.actorType}</p>}
                        {actor.subActors && actor.subActors.length > 0 && (
                            <ul>
                                {actor.subActors.map((sub, index) => (
                                    <li key={index}>{sub}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ActorsList;
