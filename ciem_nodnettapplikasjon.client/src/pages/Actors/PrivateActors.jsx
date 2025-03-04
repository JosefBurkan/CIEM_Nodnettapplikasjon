import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import Box from '../../components/Box/Box';
// import styles from './Actors.module.css';
import "../../index.css";
import styles from './ActorPages.module.css';
import { IconSearch, IconMenu2, IconMail, IconUser } from '@tabler/icons-react';
import SearchBar from '../../components/SearchBar/SearchBar';

function PrivateActors() {
    return (
        <div className={styles.privateActorsContainer}>
            <p>Private Aktører</p>
            <SearchBar/>
        </div>
    );
}

export default PrivateActors;