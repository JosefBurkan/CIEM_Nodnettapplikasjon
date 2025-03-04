import React from 'react';
import "../../index.css";
import styles from './ActorsList.module.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import { IconUser } from '@tabler/icons-react';


function ActorsList() {

    const kategori = "Private "; // Endre til valgt kategori

    return (
        <div className={styles.actorsListContainer}> 
        <br/>
            <div className={styles.topSection}>       {/*Søk og filter knapp*/}
                <button>List format</button>
                <button>Nettverk format</button>
                <SearchBar placeholder="" bgColor='#1A1A1A'/>
                <button className={styles.filterButton}>Filter</button>
            </div>

            <div className={styles.headerBox}>              {/* Boks som viser valgt kategori */}
                <IconUser className={styles.headerIcon}/>
                <span>{`${kategori}Aktører`}</span>
            </div>

            <div className={styles.contentContainer}>         {/* Hovedinnholdet - Container for aktør listene */}
                <ul className={styles.actorsList}>
                    <li className={styles.actorItem}>
                        <h1>Erik</h1>
                    </li> 
                    <li className={styles.actorItem}>
                        <h3>Erik</h3> 
                    </li>
                    <li className={styles.actorItem}>Aktør 3</li>
                    <li className={styles.actorItem}>Aktør 4</li>
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