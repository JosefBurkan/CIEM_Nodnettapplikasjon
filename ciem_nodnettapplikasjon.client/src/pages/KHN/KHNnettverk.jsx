import React, {useState} from 'react';
import styles from './KHNnettverk.module.css';
import { Link, useNavigate } from 'react-router-dom';

function KHNnettverk(){
    return(
        <div className={styles.test}>
            <h1>Krisehåndterings-nettverk</h1>
        </div>
    );
}

export default KHNnettverk;