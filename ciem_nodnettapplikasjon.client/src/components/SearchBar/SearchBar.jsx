import { IconSearch, IconMenu2, IconMail, IconUser } from '@tabler/icons-react';
import styles from './SearchBar.module.css';
import React from "react";

function SearchBar({ placeholder="Søk...", bgColor= "#4F4F4F", onSearch = () => {}, width = "18rem" }) {
    return(
        <div className={styles.searchContainer} style={{backgroundColor: bgColor, width}}>
            <div className={styles.searchBar}>
                <IconSearch className={styles.iconSearch}/>
                <input 
                    type="text" 
                    placeholder={placeholder} 
                    className={styles.searchInput}
                    onChange={(e) => onSearch(e.target.value)} 
                />
                <IconMenu2 className={styles.menuIcon}/>
            </div>
        </div>
    );
}

export default SearchBar;