import React from 'react';
import styles from './NavBar.module.css';
import logo from '../../assets/EMKORE.png';
import DateComponent from '../Date/Date.jsx';
import { IconSearch, IconMenu2, IconMail, IconUser } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';


function NavBar(){

    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarLeft}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt="EMKORE logo" className={styles.logo}/>
                </div>
                <div className={styles.searchContainer}>
                    <SearchBar/>

                    </div>

            </div>

            <div className={styles.navbarCenter}>
                <div className={styles.navbarLinks}>
                    <Link 
                        to="/krisehandterings-nettverk"  // Fixed path
                        className={`${styles.navbarLink} ${isActive("/krisehandterings-nettverk") ? styles.activeLink : ""}`}
                    >
                        Krisehåndterings-nettverk
                    </Link>
                    <Link 
                        to="/actors"  
                        className={`${styles.navbarLink} ${isActive("/actors") ? styles.activeLink : ""}`}
                    >
                        Aktører
                    </Link> 
                </div>
            </div>

            <div className={styles.navbarRight}>
                <IconMail className={styles.iconMail} />
                <IconUser className={styles.iconUser} />
                <div className={styles.clockContainer}>
                    <DateComponent />
                </div>
            </div>
        </nav>
    );
}
 
export default NavBar;
