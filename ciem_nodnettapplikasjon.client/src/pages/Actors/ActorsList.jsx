import React, { useState } from 'react';
import "../../index.css";
import styles from './ActorsList.module.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import { IconUser } from '@tabler/icons-react';


function ActorsList() {
    const kategori = "Private "; // Endre til valgt kategori

    const [actors, setActors] = useState([     /* Liste over aktrøer hardkodet. bruk setActors for å oppdatere actors med backend greiene, setActors brukes ikke atm */
        {
            name: "Verisure",
            subActors: ["Sentralbord", "Teknisk", "Overvåkning", "Ledelse"]
        },
        {
            name: "Voi",
            subActors: []
        },
        {
            name: "Å Energi",
            subActors: ["Avdeling 1", "Avdeling 2"] 
        }
    ]);

    const [dropdown, setDropdown] = useState({}); /* Starter lukket, holder styr på hvilke som er åpne. */ 

    const toggleDropdown = (actorName) => {
        setDropdown((prev) => ({
            ...prev, 
            [actorName]: !prev[actorName]   /* Sjekker true eller false for å åpne/lukke */
        }));
    };

    return (
        <div className={styles.actorsListContainer}> 
            <div className={styles.topSection}>       {/*Søk og filter knapp*/}
                <div className={styles.btnContainer}>
                    <button className={styles.midlertidigBtn}>List format</button>
                    <button className={styles.midlertidigBtn}>Nettverk format</button>
                </div>
                <div className={styles.searchBarContainer}>
                    <SearchBar placeholder="" bgColor='#1A1A1A'/>
                </div>
                <div className={styles.filterBtnContainer}>
                    <button className={styles.filterButton}>Filter</button>
                </div>
            </div>

            <div className={styles.headerBox}>              {/* Boks som viser valgt kategori */}
                <IconUser className={styles.headerIcon}/>
                <span>{`${kategori}Aktører`}</span>  {/*ikke implementert enda*/}
            </div>

            <div className={styles.contentContainer}>         {/* Hovedinnholdet - Container for aktør listene */}
                <ul className={styles.actorsList}>
                    {actors.map((actor) => (  /* Går gjennom actors og lager lister med innholdet */
                        <li key={actor.name} className={styles.actorItem}>
                            <button
                                className={styles.actorBtn}
                                onClick={() => toggleDropdown(actor.name)} /* Flipper true/false på den man trykker på */
                            >
                                {actor.name}
                                <span className={styles.arrow}>
                                    {dropdown[actor.name] ? " ▲" : " ▼"} {/* Ser om det er true eller false, og viser pil som representerer det */}
                                </span>
                            </button>
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
                <button className={styles.selectAllButton}>Velg alle</button>
                <button className={styles.showSelectionButton}>Vis utvalg</button>
            </div>

        </div>
    );
}

export default ActorsList;