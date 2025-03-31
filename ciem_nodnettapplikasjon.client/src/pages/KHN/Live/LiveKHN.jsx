import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  getOutgoers,
  getConnectedEdges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import styles from "./LiveKHN.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import CustomNode from "../../../components/CustomNode/CustomNode";

const nodeTypes = { custom: CustomNode };
const proOptions = { hideAttribution: true };

function LiveKHN() {
  const [nodeNetwork, setNodeNetwork] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState("actors");
  const [initialNodes, setInitialNodes] = useState([]);
  const [initialEdges, setInitialEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hiddenNodes, setHiddenNodes] = useState(new Set());
  const [hiddenEdges, setHiddenEdges] = useState(new Set());
  const clickTimeoutRef = useRef(null);
  const doubleClickFlagRef = useRef(false);

  // Henter nettverksdata fra API-et
  const fetchKHN = async () => {
    try {
      const response = await fetch("https://localhost:5255/api/KHN/GetNodeNetwork");
      const data = await response.json();
      setNodeNetwork(data);
      setIsReady(true);
    } catch (error) {
      console.error("Failed to fetch node network:", error);
    }
  };

  useEffect(() => {
    fetchKHN();
  }, []);

  // Oppretter noder og kanter basert på API-data
  useEffect(() => {
    if (nodeNetwork && nodeNetwork.nodes) {
      const layerCounts = new Map();
      const nodes = nodeNetwork.nodes.map((node) => {
        const count = layerCounts.get(node.layer) || 0;
        layerCounts.set(node.layer, count + 1);
        return {
          id: String(node.nodeID),
          position: { x: count * 200, y: node.layer * 100 },
          data: {
            label: node.name,
            info: `Detaljert informasjon om ${node.name}. Her kan du for eksempel vise historikk, kontaktinfo eller annen relevant beskrivelse for testing.`
          },
          type: "custom",
          hidden: hiddenNodes.has(String(node.nodeID)),
        };
      });

      // For eksempelets skyld kobles noder sekvensielt.
      const edges = nodeNetwork.nodes.map((node) => ({
        id: `${node.nodeID}-${node.nodeID + 1}`,
        source: String(node.nodeID),
        target: String(node.nodeID + 1),
        animated: true,
        hidden: hiddenEdges.has(`${node.nodeID}-${node.nodeID + 1}`),
      }));

      setInitialNodes(nodes);
      setInitialEdges(edges);
    }
  }, [nodeNetwork, hiddenNodes, hiddenEdges]);

  // Hjelpefunksjon: Finner alle etterfølgende noder (rekursivt)
  const getDescendantNodes = (node, allNodes, allEdges) => {
    const descendants = [];
    const visited = new Set();
    const stack = [node];

    while (stack.length > 0) {
      const current = stack.pop();
      const children = getOutgoers(current, allNodes, allEdges);
      children.forEach((child) => {
        if (!visited.has(child.id)) {
          visited.add(child.id);
          descendants.push(child);
          stack.push(child);
        }
      });
    }
    return descendants;
  };

  // Hjelpefunksjon: Finner alle kanter tilknyttet de rekursive etterfølgerne
  const getDescendantEdges = (node, allNodes, allEdges) => {
    const descendantNodes = getDescendantNodes(node, allNodes, allEdges);
    const descendantIds = descendantNodes.map((n) => n.id);
    const descendantEdges = allEdges.filter(
      (edge) => descendantIds.includes(edge.source) || descendantIds.includes(edge.target)
    );
    return descendantEdges;
  };

  // Collapse/expand-funksjonalitet: toggler skjul/vis for alle etterfølgerne
  const toggleCollapseExpand = useCallback(
    (node) => {
      const descendants = getDescendantNodes(node, initialNodes, initialEdges);
      const descendantEdges = getDescendantEdges(node, initialNodes, initialEdges);

      const updatedHiddenNodes = new Set(hiddenNodes);
      const updatedHiddenEdges = new Set(hiddenEdges);

      // Hvis minst én etterfølger er synlig, skal vi skjule alle; ellers vise dem.
      const shouldHide = descendants.some((desc) => !hiddenNodes.has(desc.id));

      descendants.forEach((desc) => {
        if (shouldHide) {
          updatedHiddenNodes.add(desc.id);
        } else {
          updatedHiddenNodes.delete(desc.id);
        }
      });

      descendantEdges.forEach((edge) => {
        if (shouldHide) {
          updatedHiddenEdges.add(edge.id);
        } else {
          updatedHiddenEdges.delete(edge.id);
        }
      });

      setHiddenNodes(updatedHiddenNodes);
      setHiddenEdges(updatedHiddenEdges);
    },
    [hiddenNodes, hiddenEdges, initialNodes, initialEdges]
  );

  // Enkeltklikk: sett opp timeout for å differensiere enkelt- vs. dobbeltklikk
  const handleNodeClick = useCallback(
    (event, node) => {
      clickTimeoutRef.current = setTimeout(() => {
        // Dersom et dobbeltklikk har blitt oppdaget, ignorer enkeltklikk
        if (doubleClickFlagRef.current) {
          doubleClickFlagRef.current = false;
          return;
        }
        toggleCollapseExpand(node);
        clickTimeoutRef.current = null;
      }, 200);
    },
    [toggleCollapseExpand]
  );

  // Dobbeltklikk: fjerner eventuell ventende timeout og viser detaljer
  const handleNodeDoubleClick = useCallback((event, node) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    doubleClickFlagRef.current = true;
    setSelectedNode(node);
    setActiveTab("details");
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <ReactFlowProvider>
      <div className={styles.container}>
        <div className={styles.searchBarContainer}>
          <SearchBar placeholder="Søk etter aktør" bgColor="#1A1A1A" width="25rem" />
        </div>
        <div className={styles.content}>
          <div className={styles.networkContainer}>
            <ReactFlow
              proOptions={proOptions}
              nodes={initialNodes}
              edges={initialEdges}
              fitView
              onNodeClick={handleNodeClick}
              onNodeDoubleClick={handleNodeDoubleClick}
              nodeTypes={nodeTypes}
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
              {activeTab === "details" && selectedNode && (
                <div>
                  <h3>{selectedNode.data.label}</h3>
                  <p>{selectedNode.data.info}</p>
                  <p>
                    Her kan du legge til enda mer informasjon, som for eksempel kontaktdata, historikk,
                    eller annen relevant informasjon for aktøren. Dette er testinformasjon for å sjekke at
                    dobbeltklikkfunksjonaliteten fungerer som forventet.
                  </p>
                </div>
              )}
              {activeTab === "actors" && nodeNetwork.nodes && (
                <ul>
                  {nodeNetwork.nodes.map((node) => (
                    <li key={node.nodeID}>{node.name}</li>
                  ))}
                </ul>
              )}
              {activeTab === "info" && <p>Kritisk informasjon om nettverket og tilstand...</p>}
            </div>
          </div>
        </div>
        <button className={styles.editButton}>Redigersmodus</button>
      </div>
    </ReactFlowProvider>
  );
}

export default LiveKHN;
