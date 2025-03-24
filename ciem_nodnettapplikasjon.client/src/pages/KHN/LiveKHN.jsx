import React, { useState } from "react";
import { ReactFlow, MiniMap, Controls, Background, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from "./LiveKHN.module.css"
import SearchBar from "../../components/SearchBar/SearchBar";
import CustomNode from "../../components/CustomNode/CustomNode";



const initialNodes = [ // Fyll informasjon for å vise noe. 
    { id: "1", position: { x: 250, y: 0 }, data: { label: "Krisehåndterings Sentral" }, type: "custom" },
    { id: "2", position: { x: 400, y: 80 }, data: { label: "Hoved redningssentralen" }, type: "custom" },
    { id: "3", position: { x: 100, y: 80 }, data: { label: "Nødetatene" }, type: "custom" },
    { id: "4", position: { x: 0, y: 150 }, data: { label: "Politi" }, type: "custom" },
    { id: "5", position: { x: 200, y: 150 }, data: { label: "Brannvesen" }, type: "custom" }
];

const initialEdges = [
    { id: "e1-2", source: "1", target: "2", animated: false },
    { id: "e1-3", source: "1", target: "3", animated: false },
    { id: "e3-4", source: "3", target: "4", animated: true },
    { id: "e3-5", source: "3", target: "5", animated: true }
];

const nodeTypes = { custom: CustomNode };
const proOptions = { hideAttribution: true };

function LiveKHN() {
    
    const fetchKHN = async () => {
        const response = await fetch("https://localhost:5255/api/actor")
        const data = await response.json();
        setActors(data);
    } 


    const [activeTab, setActiveTab] = useState("actors");

    return(
    <div className={styles.container}>
        <div className={styles.searchBarContainer}>
            <SearchBar 
                placeholder="Søk etter aktør" 
                bgColor='#1A1A1A'
                width="25rem"
            />
        </div>
        <div className={styles.content}>

            <div className={styles.networkContainer}> 
                <ReactFlow proOptions={proOptions} nodes={initialNodes} edges={initialEdges} fitView> {/* Reactflow libraryen som brukes for interaktivt kart */}
                    <MiniMap pannable zoomable />
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>

            <div className={styles.infoBox}>
                <div className={styles.tabContainer}>
                    <button className={`${styles.tabButton} ${activeTab === "details" ? styles.activeTab : ""}`} onClick={() => setActiveTab("details")}>
                        Detaljer
                    </button>
                    <button className={`${styles.tabButton} ${activeTab === "actors" ? styles.activeTab : ""}`} onClick={() => setActiveTab("actors")}>
                        Aktører
                    </button>
                    <button className={`${styles.tabButton} ${activeTab === "info" ? styles.activeTab : ""}`} onClick={() => setActiveTab("info")}>
                        Info kontroll
                    </button>
                </div>
                <div className={styles.tabContent}>
                    {activeTab === "details" && <p>Detaljer om valgt aktør vises her...</p>}
                    {activeTab === "actors" && <p>Liste over aktører...</p>}
                    {activeTab === "info" && <p>Kritisk informasjon...</p>}
                </div>
            </div>
        </div>
        <button className={styles.editButton}> Redigersmodus ✏️ </button>
    </div>
    );
}

export default LiveKHN;
