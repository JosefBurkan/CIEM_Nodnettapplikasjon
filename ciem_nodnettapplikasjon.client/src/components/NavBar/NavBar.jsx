import React from 'react';
import styles from './NavBar.module.css';
import logo from '../../assets/EMKORE.png';
import DateComponent from '../Date/Date.jsx';
import { IconSearch, IconMenu2, IconMail, IconUser } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';

function NavBar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarLeft}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt="EMKORE logo" className={styles.logo} />
                </div>
                <div className={styles.searchContainer}>
                    <div className={styles.searchBar}>
                        <IconSearch className={styles.iconSearch} /> {/* Non-functional search bar */}
                        <input type="text" placeholder="Søk..." className={styles.searchInput} />
                        <IconMenu2 className={styles.menuIcon} />
                    </div>
                </div>
            </div>

            <div className={styles.navbarCenter}>
                <div className={styles.navbarLinks}>
                    <Link 
                        to="/krisehandterings-nettverk"  // ✅ Fixed path
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
