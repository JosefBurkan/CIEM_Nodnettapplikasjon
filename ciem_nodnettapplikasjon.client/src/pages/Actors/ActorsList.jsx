import React, { useState } from 'react';
import "../../index.css";
import styles from './ActorsList.module.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import { IconMail, IconUser } from '@tabler/icons-react';

function ActorsList() {
    const kategori = "Private "; // Endre til valgt kategori - ikke ordnet enda

    const [actors, setActors] = useState([     /* Liste over aktrøer hardkodet. bruk setActors for å oppdatere actors med backend greiene, setActors brukes ikke atm */
        {
            id: 1,
            name: "Verisure",
            subActors: ["Sentralbord", "Teknisk", "Overvåkning", "Ledelse"]
        },
        {
            id: 2,
            name: "Voi",
            subActors: []
        },
        {
            id: 3,
            name: "Å Egi",
            subActors: ["Avdeling 1", "Avdeling 2", "Avdeling 2", "Avdeling 2", "Avdeling 2", "Avdeling 2", "Avdeling 2", "Avdeling 2"] 
        },
        {
            id: 5,
            name: "Å rgi",
            subActors: ["Avdeling 1", "Avdeling 2", "Avdeling 2", "Avdeling 2", "Avdeling 2", "Avdeling 2", "Avdeling 2", "Avdeling 2", "Avdeling 2"] 
        },

    ]);

    const [dropdown, setDropdown] = useState({}); /* Starter lukket, holder styr på hvilke som er åpne. */ 
    const [search, setSearch] = useState("");
    const [selectedActors, setSelectedActors] = useState([]);
    const [showSelectedActor, setShowSelectedActor] = useState({});
    const [tempSelectedActors, setTempSelectedActors] = useState([]);


    const toggleDropdown = (actorName) => {
        setDropdown((prev) => ({
            ...prev, 
            [actorName]: !prev[actorName]   /* Sjekker true eller false for å åpne/lukke */
        }));
    };

    const filteredActors = actors.filter(actor => {  // Søkefunksjon for aktører, sjekker om søket er i navnet eller underaktørene.
        const matchesSearch =
            actor.name.toLowerCase().includes(search.toLowerCase()) ||
            actor.subActors.some(sub => sub.toLowerCase().includes(search.toLowerCase()));
    
        if (showSelectedActor) {  // Sjekker om aktøren er valgt, og om den skal vises eller ikke
            return selectedActors.includes(actor.name) || (matchesSearch && !showSelectedActor);
        }
    
        return matchesSearch || selectedActors.includes(actor.name) || dropdown[actor.name];
    });

    const toggleTempSelectedActor = (actorName) => {
        setTempSelectedActors((prev) =>
            prev.includes(actorName)
                ? prev.filter(name => name !== actorName) // Fjern hvis allerede valgt
                : [...prev, actorName] // Legg til hvis ikke valgt
        );
    };
    

    return (
        <div className={styles.x}> 
            <div className={styles.topSection}>       {/*Søk, filter og knapper container*/}
                <div className={styles.btnContainer}>
                    <button className={styles.midlertidigBtn}>List format</button>
                    <button className={styles.midlertidigBtn}>Nettverk format</button>
                </div>
                <div className={styles.searchBarContainer}>
                    <SearchBar 
                        placeholder="" 
                        bgColor='#1A1A1A'
                        onSearch={setSearch}
                    />
                </div>
                <div className={styles.filterBtnContainer}>
                    <button className={styles.filterButton}>Filter</button>
                </div>
                <button>
                    <IconMail className={styles.mailIcon}/> 
                </button>
                <button>
                    <IconUser className={styles.userIcon}/> 
                </button>
            </div>
            <div className={styles.headerBoxContainer}>    
                <div className={styles.headerBox}>              {/* Boks som viser valgt kategori */}
                    <IconUser className={styles.headerIcon}/>
                    <span>{`${kategori}Aktører`}</span>  {/* ikke implementert enda */}
                </div>
            </div>

            <div className={styles.contentContainer}>         {/* Hovedinnholdet - Container for aktør listene */}
                <ul className={styles.actorsList}>
                    {filteredActors.map((actor) => (  /* Går gjennom actors og lager lister med innholdet */
                        <li key={actor.name} className={styles.actorItem}>
                            <div className={styles.actorListContainer}>
                                <input              // Checkbox for å velge aktører
                                    className={styles.actorCheckbox}
                                    type="checkbox"
                                    checked={tempSelectedActors.includes(actor.name)}
                                    onChange={() => toggleTempSelectedActor(actor.name)}
                                />
                                <button
                                    className={`${styles.actorBtn}   ${dropdown[actor.name] ? styles.activeDropdown : ''}`}
                                    onClick={() => toggleDropdown(actor.name)}     // Flipper true/false på den man trykker på
                                >
                                    {actor.name}
                                    <span className={`${styles.arrow} ${dropdown[actor.name] ? styles.activeArrow : ''}`}>
                                        {dropdown[actor.name] ? " ▲" : " ▼"} {/* Ser om det er true eller false, og viser pil som representerer det */}
                                    </span>
                                </button>
                            </div>
                            {dropdown[actor.name] && (
                                <ul className={styles.subActors}>
                                    {actor.subActors.length > 0 ? (
                                        actor.subActors.map((sub, i) => (
                                            <li key={i} className={styles.subActor}>  {/* Ser om subActor > 0, som vil si ingen subactors, og gir "Ingen underaktører" */}
                                                {sub}
                                            </li>
                                        ))
                                    ) : (
                                        <li className={styles.noSubActor}>Ingen underaktører</li>
                                    )}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.bottomSection}>            {/*Velg alle og vis utvalg knapp*/}
                <button onClick={() => { setShowSelectedActor(false); setSearch("");}} className={styles.selectAllButton}>Vis alle</button>
                <button onClick={() => { setShowSelectedActor(true); setSelectedActors(tempSelectedActors);}} className={styles.showSelectionButton}>Oppdater Utvalg 🔄️</button>
            </div>

        </div>
    );
}

export default ActorsList;