import React, { useState, useEffect } from "react";
import { ReactFlow, MiniMap, Controls, Background, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from "./LiveKHN.module.css"
import SearchBar from "../../../components/SearchBar/SearchBar";
import { useParams } from "react-router-dom";



const proOptions = { hideAttribution: true };


function LiveKHN() {

    const { networkId } = useParams();

    const [nodeNetwork, setNodeNetwork] = useState({});
    const [isReady, setIsReady] = useState(false); // Tracks if the node network has recieved its data yet
    const [activeTab, setActiveTab] = useState("actors");
    const [initialNodes, setInitialNodes] = useState([]);
    const [initialEdges, setInitialEdges] = useState([]);


    const FetchKHN = async () => {
        try {
            const response = await fetch(`https://localhost:5255/api/KHN/GetNodeNetwork/${networkId}`);
            const data = await response.json();
            console.log(data);
            setNodeNetwork(data);
            setIsReady(true);
            console.log("Fetch successful!", typeof data);

        }
        catch (error) {
            console.log("Fetch KHN failed to fetch: ", error);
        }
    }

    // Fetch the data
    useEffect(() => {
        FetchKHN();
    }, [networkId]);


    // Visualise the node data
    useEffect(() => {
        if (nodeNetwork && nodeNetwork.nodes) {
            const layerCounts = new Map();

            const nodes = nodeNetwork.nodes.map((node) => {
                const xPos = layerCounts.get(node.layer) || 0;
                    layerCounts.set(node.layer, xPos + 1);

                return {
                    id: String(node.nodeID),
                    position: { x: xPos * 200, y: 0 + (node.layer * 100) },
                    data: { label: node.name },
                  
                };
            });

            const edges = nodeNetwork.nodes.map((node) => ({
                id: `${node.nodeID} - ${node.nodeID + 1}`,
                source: String(node.nodeID),
                target: String(node.nodeID + 1),
                animated: true,
            }));

            setInitialNodes(nodes);
            setInitialEdges(edges);
        }
    }, [nodeNetwork]); // Runs when nodeNetwork is updated


    if (!isReady) {
        return <div>Loading...</div>; // Show loading message while waiting for data
    }


    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{nodeNetwork.name}</h2>

            <div className={styles.searchBarContainer}>
                <SearchBar
                    placeholder="Søk etter aktør"
                    bgColor='#1A1A1A'
                    width="25rem"
                />
            </div>


            <div className={styles.content}>
                <div className={styles.networkContainer}>
                <ReactFlowProvider>
                    <ReactFlow
                        proOptions={proOptions}
                        nodes={initialNodes}
                        edges={initialEdges}
                        fitView
                    
                        >
                        <MiniMap pannable zoomable />
                        <Controls />
                        <Background />
                        </ReactFlow>
                    </ReactFlowProvider>
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