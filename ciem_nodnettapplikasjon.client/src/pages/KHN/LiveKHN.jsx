import React, { useState, useEffect } from "react";
import { ReactFlow, MiniMap, Controls, Background, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from "./LiveKHN.module.css"
import SearchBar from "../../components/SearchBar/SearchBar";
import CustomNode from "../../components/CustomNode/CustomNode";
import CollapseExpand from "../../components/CollapseExpand/CollapseExpand";




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
    const [selectedNode, setSelectedNode] = useState(null);
    const fetchNodes = async (nodes) => {

    }

    const [nodeNetwork, setNodeNetwork] = useState({});
    const [isReady, setIsReady] = useState(false); // Tracks if the node network has recieved its data yet
    const [activeTab, setActiveTab] = useState("actors");
    const [initialNodes, setInitialNodes] = useState([]);
    const [initialEdges, setInitialEdges] = useState([]);
    let xCoordinate = 0; 


    const FetchKHN = async () => {
        try
        {
            const response = await fetch("https://localhost:5255/api/KHN/GetNodeNetwork")
            const data = await response.json();
            console.log(data);
            setNodeNetwork(data);
            setIsReady(true);
            console.log("Fetch successful!", typeof data);

        }
        catch (error)
        {
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
            const layerCounts = new Map();
            const nodes = nodeNetwork.nodes.map((node) => {

                const xPos = layerCounts.get(node.layer) || 0;

                layerCounts.set(node.layer, xPos + 1);
                
                return {
                    id: String(node.nodeID),
                    position: { x: xPos * 200, y: 0 + (node.layer * 100) },
                    data: { label: node.name },
                    type: "custom"
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
        <div className={styles.searchBarContainer}>
            <SearchBar 
                placeholder="Søk etter aktør" 
                bgColor='#1A1A1A'
                width="25rem"
            />
        </div>
        <div className={styles.content}>

            <div className={styles.networkContainer}> 
                {/* <ReactFlow proOptions={proOptions} nodes={initialNodes} edges={initialEdges} fitView> */}
                    {/* <MiniMap pannable zoomable /> */}
                    {/* <Controls /> */}
                    {/* <Background /> */}
                {/* </ReactFlow> */}
                <CollapseExpand onSelectNode={setSelectedNode} />
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
                    {activeTab === "info" && (
                    <div>
                        {selectedNode ? (
                        <div>
                            <h3>Info om valgt node:</h3>
                            <p><strong>ID:</strong> {selectedNode.id}</p>
                            <p><strong>Navn:</strong> {selectedNode.data?.label}</p>
                            <p><strong>Beskrivelse: </strong>{selectedNode.data?.description}</p>
                        </div>
                        ) : (
                        <p>Ingen node valgt.</p>
                        )}
                    </div>
                    )}
                </div>
            </div>
        </div>
        <button className={styles.editButton}> Redigersmodus ✏️ </button>
    </div>
    );
}

export default LiveKHN;
