import React, { useState } from 'react';
import styles from './NewActor.module.css';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';

const NewActor = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                Søk i Databaser
                <SearchBar
                    placeholder="Search actors..."
                    bgColor="#1A1A1A"
                    // onSearch={setSearch}
                />
                <span>eller...</span>
                <button
                    className={styles.button}
                    onClick={() => navigate('/createActor')}
                >
                    Opprett ny aktør
                </button>
            </div>
        </div>
    );
};

export default NewActor;
