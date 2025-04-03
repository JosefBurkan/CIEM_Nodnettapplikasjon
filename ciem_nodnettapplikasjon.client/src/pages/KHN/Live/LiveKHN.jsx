import React, { useState, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styles from "./LiveKHN.module.css"
import SearchBar from "../../../components/SearchBar/SearchBar";
import { useParams } from "react-router-dom";
import CustomNode from "../../../components/CustomNode/CustomNode.jsx";
import FloatingEdge from "../../../components/FloatingEdge";


const proOptions = { hideAttribution: true };
const nodeTypes = { custom: CustomNode };
const edgeTypes = { floatingEdge: FloatingEdge };


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
            const nodes = nodeNetwork.nodes.map((node) => ({
                id: String(node.nodeID),
                position: { x: node.childID * 200, y: 0 + node.parentID * 100 },
                data: { label: node.name },
            }));
    
            const edges = nodeNetwork.nodes.map((node) => ({
                id: `${node.nodeID} - ${node.nodeID + 1}`,
                source: String(node.parentID),
                target: String(node.nodeID),
                animated: true,
            }));
    
            setInitialNodes(nodes);
            setInitialEdges(edges);
        }
    }, [nodeNetwork]); // Runs when nodeNetwork is updated
    

    if (!isReady) {
        return <div>Loading...</div>; // Show loading message while fetching data due to async method
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
  };

  function LiveKHNContent() {
    const updateNodeData = useCallback((id, newData) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, ...newData, onUpdate: updateNodeData } }
            : node
        )
      );
    }, []);
  
    const initialNodes = [
      {
        id: "1",
        position: { x: 250, y: 0 },
        data: { label: "Krisehåndterings Sentral", statusLevel: 1, color: "#ffcccc", onUpdate: updateNodeData },
        type: "custom",
      },
      {
        id: "2",
        position: { x: 400, y: 80 },
        data: { label: "Hoved redningssentralen", statusLevel: 2, color: "#fff0b3", onUpdate: updateNodeData },
        type: "custom",
      },
      {
        id: "3",
        position: { x: 100, y: 80 },
        data: { label: "Nødetatene", statusLevel: 3, color: "#ccffcc", onUpdate: updateNodeData },
        type: "custom",
      },
      {
        id: "4",
        position: { x: 0, y: 150 },
        data: { label: "Politi", statusLevel: 1, color: "#fff0b3", onUpdate: updateNodeData },
        type: "custom",
      },
      {
        id: "5",
        position: { x: 200, y: 150 },
        data: { label: "Brannvesen", statusLevel: 2, color: "#ccffcc", onUpdate: updateNodeData },
        type: "custom",
      }
    ];
  
    const initialEdges = [
      { id: "e1-2", source: "1", target: "2", type: "floatingEdge", animated: false },
      { id: "e1-3", source: "1", target: "3", type: "floatingEdge", animated: false },
      { id: "e3-4", source: "3", target: "4", type: "floatingEdge", animated: true },
      { id: "e3-5", source: "3", target: "5", type: "floatingEdge", animated: true }
    ];
  
    const proOptions = { hideAttribution: true };
  
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [selectedElements, setSelectedElements] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState("actors");
  
    const onNodesChange = useCallback(
      (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
      []
    );
    const onEdgesChange = useCallback(
      (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
      []
    );
    const onConnect = useCallback(
      (params) => setEdges((eds) => addEdge(params, eds)),
      []
    );
    const onSelectionChange = useCallback((elements) => {
      setSelectedElements(elements || []);
    }, []);
  
    const addNode = () => {
      const newId = (nodes.length + 1).toString();
      const newNode = {
        id: newId,
        position: { x: 100 + Math.random() * 300, y: 100 + Math.random() * 300 },
        data: { label: `Ny Aktør ${newId}`, statusLevel: 0, color: "#ffffff", onUpdate: updateNodeData },
        type: "custom",
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
  
    return (
      <div className={styles.container}>
        <div className={styles.searchBarContainer}>
          <SearchBar placeholder="Søk etter aktør" bgColor="#1A1A1A" width="25rem" />
        </div>
        <div className={styles.content}>
          <div className={styles.networkContainer}>
            <ReactFlow
              proOptions={proOptions}
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onSelectionChange={onSelectionChange}
              nodesDraggable={editMode}
              nodesConnectable={true}
              elementsSelectable={true}
              fitView
            >
              <MiniMap pannable zoomable nodeColor={(n) => n.data.color || '#eee'} />
              <Controls />
              <Background />
            </ReactFlow>
            {editMode && (
              <div className={styles.editButtons}>
                <button onClick={addNode} className={styles.smallButton}>Legg til aktør</button>
                <button onClick={deleteSelected} className={styles.smallButton}>Slett valgte</button>
              </div>
            )}
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
              {activeTab === "actors" && <p>Liste over aktører...</p>}
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
