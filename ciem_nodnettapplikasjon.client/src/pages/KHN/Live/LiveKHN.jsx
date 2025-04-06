import React, { useState, useEffect, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import styles from "./LiveKHN.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import { useParams } from "react-router-dom";
import CustomNode from "../../../components/CustomNode/CustomNode.jsx";
import FloatingEdge from "../../../components/FloatingEdge";

const nodeTypes = { custom: CustomNode };
const edgeTypes = { floatingEdge: FloatingEdge };
const proOptions = { hideAttribution: true };

function LiveKHN() {
  const { networkId } = useParams();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeNetwork, setNodeNetwork] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState("actors");
  const [editMode, setEditMode] = useState(false);
  const [selectedElements, setSelectedElements] = useState([]);

  const fetchKHN = async () => {
    try {
      const res = await fetch(`https://localhost:5255/api/KHN/GetNodeNetwork/${networkId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      setNodeNetwork(data);
      setIsReady(true);
    } catch (err) {
      console.error("Fetch KHN failed:", err);
    }
  };

  useEffect(() => {
    fetchKHN();
  }, [networkId]);

  useEffect(() => {
    if (nodeNetwork?.nodes?.length > 0) {
      const generatedNodes = nodeNetwork.nodes.map((node) => ({
        id: String(node.nodeID),
        position: { x: node.childID * 200, y: node.parentID * 100 },
        data: {
          label: node.name,
          statusLevel: node.statusLevel,
          color: node.color || "#ffffff",
          onUpdate: updateNodeData
        },
        type: "custom"
      }));

      const generatedEdges = nodeNetwork.nodes.map((node) => ({
        id: `e${node.parentID}-${node.nodeID}`,
        source: String(node.parentID),
        target: String(node.nodeID),
        type: "floatingEdge",
        animated: true
      }));

      setNodes(generatedNodes);
      setEdges(generatedEdges);
    }
  }, [nodeNetwork]);

  const updateNodeData = useCallback((id, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...newData, onUpdate: updateNodeData } }
          : node
      )
    );
  }, []);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const onSelectionChange = useCallback((els) => setSelectedElements(els || []), []);

  const addNode = () => {
    const newId = (nodes.length + 1).toString();
    const newNode = {
      id: newId,
      position: { x: 100 + Math.random() * 300, y: 100 + Math.random() * 300 },
      data: {
        label: `Ny Aktør ${newId}`,
        statusLevel: 0,
        color: "#ffffff",
        onUpdate: updateNodeData
      },
      type: "custom"
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const deleteSelected = () => {
    if (selectedElements.length) {
      const selectedIds = selectedElements.map((el) => el.id);
      setNodes((nds) => nds.filter((node) => !selectedIds.includes(node.id)));
      setEdges((eds) => eds.filter((edge) => !selectedIds.includes(edge.id)));
    }
  };

  if (!isReady) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{nodeNetwork.name}</h2>

      <div className={styles.searchBarContainer}>
        <SearchBar placeholder="Søk etter aktør" bgColor="#1A1A1A" width="25rem" />
      </div>

      <div className={styles.content}>
        <div className={styles.networkContainer}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onSelectionChange={onSelectionChange}
              nodesDraggable={editMode}
              nodesConnectable={editMode}
              elementsSelectable={editMode}
              fitView
              proOptions={proOptions}
            >
              <MiniMap pannable zoomable nodeColor={(n) => n.data.color || "#eee"} />
              <Controls />
              <Background />
            </ReactFlow>

            {editMode && (
              <div className={styles.editButtons}>
                <button onClick={addNode} className={styles.smallButton}>Legg til aktør</button>
                <button onClick={deleteSelected} className={styles.smallButton}>Slett valgte</button>
              </div>
            )}
          </ReactFlowProvider>
        </div>

        <div className={styles.infoBox}>
          <div className={styles.tabContainer}>
            {["details", "actors", "info"].map((tab) => (
              <button
                key={tab}
                className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "details" && "Detaljer"}
                {tab === "actors" && "Aktører"}
                {tab === "info" && "Info kontroll"}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {activeTab === "details" && <p>Detaljer om valgt aktør vises her...</p>}
            {activeTab === "actors" && (
              <ul>
                {nodeNetwork.nodes.map((node) => (
                  <li key={node.nodeID}>{node.name}</li>
                ))}
              </ul>
            )}
            {activeTab === "info" && <p>Kritisk informasjon...</p>}
          </div>
        </div>
      </div>

      <button className={styles.editButton} onClick={() => setEditMode((prev) => !prev)}>
        {editMode ? "Avslutt redigeringsmodus" : "Redigeringsmodus ✏️"}
      </button>
    </div>
  );
}

export default LiveKHN;
