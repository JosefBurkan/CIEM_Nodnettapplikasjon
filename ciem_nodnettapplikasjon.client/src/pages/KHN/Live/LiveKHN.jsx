import React, { useState, useEffect } from "react";
import { ReactFlow, MiniMap, Controls, Background, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from "./LiveKHN.module.css"
import SearchBar from "../../../components/SearchBar/SearchBar";
import CustomNode from "../../../components/CustomNode/CustomNode";




const nodeTypes = { custom: CustomNode };
const proOptions = { hideAttribution: true };




function LiveKHN() {

    const fetchNodes = async (nodes) => {

    }

    const [nodeNetwork, setNodeNetwork] = useState({});
    const [isReady, setIsReady] = useState(false); // Tracks if the node network has recieved its data yet
    const [activeTab, setActiveTab] = useState("actors");
    const [initialNodes, setInitialNodes] = useState([]);
    const [initialEdges, setInitialEdges] = useState([]);
    let xCoordinate = 0;


    const FetchKHN = async () => {
        try {
            const response = await fetch("https://localhost:5255/api/KHN/GetNodeNetwork")
            const data = await response.json();
            console.log(data);
            setNodeNetwork(data);
            setIsReady(true);
            console.log("Fetch successful!", typeof data);

        }
        catch (error) {
            console.log("fetchKHN failed to fetch: ", error);
        }
    }

    // Fetch the data
    useEffect(() => {
        FetchKHN();
    }, []);


    // Visualise the node data
    useEffect(() => {
        if (nodeNetwork && nodeNetwork.nodes) {
            const nodes = nodeNetwork.nodes.map((node) => {
                return {
                    id: String(node.nodeID),
                    position: { x: (node.childID * 200), y: 0 + (node.parentID * 100) },
                    data: { label: node.name },
                    type: "custom"
                };
            });

            const edges = nodeNetwork.nodes.map((node) => ({
                id: `${node.nodeID} - ${node.nodeID + 1}`,
                source: String(node.parentID),
                target: String(node.nodeID),
                animated: true,
            }));

            setInitialNodes(nodes);
            setInitialEdges(edges);
        }
    }, [nodeNetwork]); // Runs when nodeNetwork is update

    if (!isReady) {
        return <div>Loading...</div>; // Show loading message while fetching data due to async method
    }

    return (
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

                        {activeTab === "actors" && (
                            <ul>
                                {nodeNetwork.nodes.map((node) => (
                                    <p key={node.nodeID}>{node.name}</p>
                                ))}
                            </ul>
                        )}
                        {activeTab === "info" && <p>Kritisk informasjon...</p>}
                    </div>
                </div>
            </div>
            <button className={styles.editButton}> Redigersmodus</button>
        </div>
    );
}

export default LiveKHN;