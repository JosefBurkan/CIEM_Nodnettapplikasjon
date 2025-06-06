import React from 'react';
import Box from '../../components/Box/Box';
import styles from './Actors.module.css';
import '../../index.css';

function Actors() {
    return (
        <div className={styles.actorsContainer}> {/* Actors Dashboard, reusing Box Components */} 
            <Box
                title="Private Aktører"
                boxIconColor="#0A77A6"
                destination="/actorsPrivate"
            />
            <Box
                title="Frivillige Aktører"
                boxIconColor="#E8D652"
                destination="/actorsVol"
            />
            <Box
                title="Statlige Aktører"
                boxIconColor="#FF3F3F"
                destination="/actorsGov"
            />
            <Box
                title="Alle Aktører"
                boxIconColor="#D2D2D2"
                destination="/actorsAll"
            />
            <Box
                title="Ny Aktør"
                boxIconColor="#057A36"
                destination="/createActor"
            />
        </div>
    );
}

export default Actors;
