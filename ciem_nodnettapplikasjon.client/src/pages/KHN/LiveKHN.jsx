import React from "react";
import {ReactFlow, MiniMap, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from "./LiveKHN.module.css"
import SearchBar from "../../components/SearchBar/SearchBar";
// import "../../index.css";

function LiveKHN(){

    const initialNodes = [ // Fyll informasjon for å vise noe. 
        { id: "1", position: { x: 250, y: 0 }, data: { label: "Krisehåndterings Sentral" } },
        { id: "2", position: { x: 400, y: 80 }, data: { label: "Hoved redningssentralen" } },
        { id: "3", position: { x: 100, y: 80 }, data: { label: "Nødetatene" } },
        { id: "4", position: { x: 0, y: 150 }, data: { label: "Politi" } },
        { id: "5", position: { x: 200, y: 150 }, data: { label: "Brannvesen" } }
    ];

    const proOptions = { hideAttribution: true };

    return(<>
    <div className={styles.container}>
        <div className={styles.searchBarContainer}>
            <SearchBar 
                placeholder="" 
                bgColor='#1A1A1A'
                width="25rem"
            />
        </div>

        <div className={styles.networkContainer}> 
            <ReactFlow proOptions={proOptions} nodes={initialNodes} edges={[]} fitView> {/* Reactflow for å lage et interaktivt kart for visualisering av nettverk */}
                <MiniMap pannable zoomable />
                <Controls />
                <Background />
                
            </ReactFlow>
        </div>
    </div>
    </>);
}

export default LiveKHN;
