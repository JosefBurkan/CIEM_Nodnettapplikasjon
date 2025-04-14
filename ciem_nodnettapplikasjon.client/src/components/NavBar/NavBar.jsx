import React, { useState } from 'react';
import styles from './NavBar.module.css';
import logo from '../../assets/EMKORE.png';
import DateComponent from '../Date/Date.jsx';
import { IconSearch, IconMenu2, IconMail, IconUser } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar.jsx';

function NavBar() {

    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <nav className={styles.navbar}>

            <div className={styles.navbarLeft}>
                <div className={styles.logoContainer}>
                    <Link to="/dashboard" className={styles.logoLink}>
                        <img src={logo} alt="EMKORE logo" className={styles.logo} /> {/*Logo som home knapp*/}
                    </Link>
                </div>
                <SearchBar />
            </div>
            <div className={styles.navbarCenter}>
                <div className={styles.navbarLinks}>
                    {/* <Link to="/khs" className={styles.navbarLink}>Krisehåndterings-nettverk</Link> */}
                    {/* <Link to="/actors" className={styles.navbarLink}>Aktører</Link> */}
                    <Link
                        to="/samvirke-nettverk"
                        className={`${styles.navbarLink} ${isActive("/samvirke-nettverk") ? styles.activeLink : ""}`}>Samvirke-nettverk
                    </Link>
                    <Link
                        to="/actors"
                        className={`${styles.navbarLink} ${isActive("/actor") ? styles.activeLink : ""}`}>Aktører
                    </Link> {/*Visualiserer når man er på siden, strek under aktører*/}
                    <Link
                        to="/qr-code"
                        className={`${styles.navbarLink} ${isActive("/qr-code") ? styles.activeLink : ""}`}>QRcode
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