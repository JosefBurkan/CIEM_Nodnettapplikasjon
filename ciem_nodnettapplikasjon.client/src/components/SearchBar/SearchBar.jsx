import { IconSearch, IconMenu2, IconMail, IconUser } from '@tabler/icons-react';
import styles from './SearchBar.module.css';
import React from "react";

function SearchBar(){
    return(
        <div className={styles.searchContainer}>
            <div className={styles.searchBar}>
                <IconSearch className={styles.iconSearch}/> {/*   Ikke fungerende search bar  */}
                <input type="text" placeholder="Søk..." className={styles.searchInput}/>
                <IconMenu2 className={styles.menuIcon}/>
            </div>
        </div>
    );
}

export default SearchBar;