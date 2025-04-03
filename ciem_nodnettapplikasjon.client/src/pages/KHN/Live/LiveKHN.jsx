import React, { useState, useEffect } from "react";
import { ReactFlow, MiniMap, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from "./LiveKHN.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import CustomNode from "../../../components/CustomNode/CustomNode";

const nodeTypes = { custom: CustomNode };
const proOptions = { hideAttribution: true };

function LiveKHN() {
  const [nodeNetwork, setNodeNetwork] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState("actors");
  const [initialNodes, setInitialNodes] = useState([]);
  const [initialEdges, setInitialEdges] = useState([]);

  const FetchKHN = async () => {
    try {
      const response = await fetch("https://localhost:5255/api/KHN/GetNodeNetwork");

      if (!response.ok) {
        const errorText = await response.text(); // Instead of .json()
        throw new Error(`Server Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setNodeNetwork(data);
      setIsReady(true);
      console.log("Fetch successful!", data);
    } catch (error) {
      console.error("fetchKHN failed to fetch: ", error.message);
    }
  };

  useEffect(() => {
    FetchKHN();
  }, []);

  useEffect(() => {
    if (nodeNetwork && nodeNetwork.nodes) {
      const layerCounts = new Map();
      const nodes = nodeNetwork.nodes.map((node) => {
        const xPos = layerCounts.get(node.layer) || 0;
        layerCounts.set(node.layer, xPos + 1);

        return {
          id: String(node.nodeID),
          position: { x: xPos * 200, y: node.layer * 100 },
          data: { label: node.name },
          type: "custom"
        };
      });

      const edges = nodeNetwork.nodes.map((node) => ({
        id: `${node.nodeID}-${node.nodeID + 1}`,
        source: String(node.nodeID),
        target: String(node.nodeID + 1),
        animated: true,
      }));

      setInitialNodes(nodes);
      setInitialEdges(edges);
    }
  }, [nodeNetwork]);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchBarContainer}>
        <SearchBar placeholder="Søk etter aktør" bgColor="#1A1A1A" width="25rem" />
      </div>

      <div className={styles.content}>
        <div className={styles.networkContainer}>
          <ReactFlow
            proOptions={proOptions}
            nodeTypes={nodeTypes}
            nodes={initialNodes}
            edges={initialEdges}
            fitView
          >
            <MiniMap pannable zoomable />
            <Controls />
            <Background />
          </ReactFlow>
        </div>

        <div className={styles.infoBox}>
          <div className={styles.tabContainer}>
            <button
              className={`${styles.tabButton} ${activeTab === "details" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Detaljer
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "actors" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("actors")}
            >
              Aktører
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "info" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("info")}
            >
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

      <button className={styles.editButton}>Redigersmodus</button>
    </div>
  );
}

export default LiveKHN;
