import React, { useState } from 'react';
import styles from './NavBar.module.css';
import logo from '../../assets/EMKORE.png';
import DateComponent from '../Date/Date.jsx';
import { IconSearch, IconMenu2, IconMail, IconUser } from '@tabler/icons-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar.jsx';

function NavBar() {
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);
    const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user");
        sessionStorage.removeItem("isAuthenticated");
        navigate("/login");
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarLeft}>
                <div className={styles.logoContainer}>
                    <Link to="/dashboard" className={styles.logoLink}>
                        <img
                            src={logo}
                            alt="EMKORE logo"
                            className={styles.logo}
                        />
                    </Link>
                </div>
                {/* <SearchBar /> */}
            </div>
            <div className={styles.navbarCenter}>
                <div className={styles.navbarLinks}>
                    <Link
                        to="/nodeNetworks"
                        className={`${styles.navbarLink} ${isActive('/nodeNetworks') || isActive('/liveNetwork') || isActive('/nettverk') || isActive('/newNetwork') ? styles.activeLink : ''}`}
                    >
                        Samvirke Nettverk
                    </Link>
                    <Link
                        to="/actors"
                        className={`${styles.navbarLink} ${isActive('/actor') || isActive('/createActor') ? styles.activeLink : ''}`}
                    >
                        Aktører
                    </Link>
                    <Link
                        to="/qr-code"
                        className={`${styles.navbarLink} ${isActive('/qr-code') ? styles.activeLink : ''}`}
                    >
                        QRcode
                    </Link>
                </div>
            </div>

            <div className={styles.navbarRight}>
                <IconMail className={styles.iconMail} />

                <div className={styles.userContainer}>
                    <IconUser
                        className={styles.iconUser}
                        onClick={() => setShowLogout(!showLogout)}
                    />
                    {showLogout && (
                        <div className={styles.logoutDropdown}>
                            <button onClick={handleLogout}>Logg ut</button>
                        </div>
                    )}
                </div>

                <div className={styles.clockContainer}>
                    <DateComponent />
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
