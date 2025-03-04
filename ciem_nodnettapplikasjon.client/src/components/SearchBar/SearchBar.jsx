import { IconSearch, IconMenu2, IconMail, IconUser } from '@tabler/icons-react';
import styles from './SearchBar.module.css';
import React from "react";

function SearchBar({ placeholder="Søk...", bgColor= "#4F4F4F" }) {
    return(
        <div className={styles.searchContainer} style={{backgroundColor: bgColor}}>
            <div className={styles.searchBar}>
                <IconSearch className={styles.iconSearch}/> {/*   Ikke fungerende search bar  */}
                <input type="text" placeholder={placeholder} className={styles.searchInput}/>
                <IconMenu2 className={styles.menuIcon}/>
            </div>
        </div>
    );
}

export default SearchBar;