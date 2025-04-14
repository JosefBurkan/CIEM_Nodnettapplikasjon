import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  getOutgoers,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import dagre from "dagre";
import "@xyflow/react/dist/style.css";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./LiveKHN.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import AddActor from "./AddActor";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const proOptions = { hideAttribution: true };

function getLayoutedElements(nodes, edges, direction = "TB") {  
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 180;
  const nodeHeight = 50;

  dagreGraph.setGraph({
    rankdir: direction,
    ranksep: 100,
    nodeSep: 80,
    edgeSep: 50,
  });

  nodes.forEach((node) => {
    if (!node.hidden) {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    }
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    if (nodeWithPosition) {
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
    }
    return node;
  });

  return { nodes: layoutedNodes, edges };
}

function LiveKHN() {

    const navigate = useNavigate();
  const { networkId } = useParams();

  const [nodeNetwork, setNodeNetwork] = useState({});
  const [isReady, setIsReady] = useState(false);

  const [initialNodes, setInitialNodes] = useState([]);
  const [initialEdges, setInitialEdges] = useState([]);

  const [hiddenNodes, setHiddenNodes] = useState(new Set());
  const [hiddenEdges, setHiddenEdges] = useState(new Set());

  const [activeTab, setActiveTab] = useState("actors");
  const [selectedNode, setSelectedNode] = useState(null);
    const [showAddActorModal, setShowAddActorModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Få tak i ReactFlow-instansen for å kunne sentrere kameraet
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const clickTimeoutRef = useRef(null);
    const doubleClickFlagRef = useRef(false);

 



  // Hent data fra API (bruker networkId fra URL)
  const fetchKHN = async () => {
    try {
      const response = await fetch(`https://localhost:5255/api/KHN/GetNodeNetwork/${networkId}`);
      const data = await response.json();
      console.log("Fetched data:", data);
      setNodeNetwork(data);
      setIsReady(true);
    } catch (error) {
      console.error("Failed to fetch node network:", error);
    }
  };

  useEffect(() => {
    if (networkId) {
      fetchKHN();
    }
  }, [networkId]);


    const handleArchiveNetwork = async () => {
        try {
            const res = await fetch(`https://localhost:5255/api/KHN/archive/${networkId}`, {
                method: "POST",
            });

            if (res.ok) {
                toast.success("Nettverket ble arkivert!");
                navigate("/nettverks-arkiv");
            } else {
                toast.error("Kunne ikke arkivere nettverket.");
            }
        } catch (err) {
            console.error("Error archiving network:", err);
            toast.error("En feil oppstod under arkivering.");
        }
    };

  // Oppdater layout: generer noder og kanter fra nodeNetwork og hidden-sets
  const updateLayout = useCallback(() => {
    if (nodeNetwork && nodeNetwork.nodes) {
      const nodes = nodeNetwork.nodes.map((node) => ({
        id: String(node.nodeID),
        data: { label: node.name, info: `Detaljert info om ${node.name}` },
        hidden: hiddenNodes.has(String(node.nodeID)),
        position: { x: 0, y: 0 },
      }));

      const edges = nodeNetwork.nodes
        .filter((n) => n.parentID != null && n.parentID !== 0)
        .map((n) => ({
          id: `edge-${n.parentID}-${n.nodeID}`,
          source: String(n.parentID),
          target: String(n.nodeID),
          animated: true,
          hierarchical: true,
          hidden: hiddenEdges.has(`edge-${n.parentID}-${n.nodeID}`),
        }));

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, "TB");
      setInitialNodes(layoutedNodes);
      setInitialEdges(layoutedEdges);
    }
  }, [nodeNetwork, hiddenNodes, hiddenEdges]);

  useEffect(() => {
    updateLayout();
  }, [nodeNetwork, hiddenNodes, hiddenEdges, updateLayout]);

  const focusNode = useCallback(
    (actor) => {
      if (!reactFlowInstance || !actor) return;
      console.log("Fokusere på actor:", actor);
      const node = initialNodes.find(n => n.id === String(actor.nodeID));
      if (!node) {
        console.log("Fant ikke node for actor:", actor);
        return;
      }
      const x = node.position.x + 90; // juster ut fra nodens dimensjoner
      const y = node.position.y + 25;
      reactFlowInstance.setCenter(x, y, 1.5);
      setActiveTab("details");
      setSelectedNode(node);
    },
    [reactFlowInstance, initialNodes]
  );

  const handleDeleteNode = useCallback(() => {
    if (!selectedNode) return;
    const nodeIdToDelete = selectedNode.id;

    const updatedNodes = nodeNetwork.nodes.filter(
      (n) => String(n.nodeID) !== nodeIdToDelete
    );
    setNodeNetwork((prev) => ({
      ...prev,
      nodes: updatedNodes
    }));
    setSelectedNode(null);
    updateLayout();
  }, [selectedNode, nodeNetwork, updateLayout]);


  // const handleSearch = useCallback((query) => {
  //   // Vi kan legge til live-søk her om nødvendig, men nå lar vi fokus skje via onSelectActor i SearchBar.
  //   console.log("Søker med query:", query);
  // }, []);

  // Hjelpefunksjoner for collapse/expand
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

  const getDescendantEdges = (node, allNodes, allEdges) => {
    const descendantNodes = getDescendantNodes(node, allNodes, allEdges);
    const descendantIds = descendantNodes.map((n) => n.id);
    return allEdges.filter(
      (edge) => descendantIds.includes(edge.source) || descendantIds.includes(edge.target)
    );
  };

  const toggleCollapseExpand = useCallback(
    (node) => {
      const descendants = getDescendantNodes(node, initialNodes, initialEdges);
      const descendantEdges = getDescendantEdges(node, initialNodes, initialEdges);
      const updatedHiddenNodes = new Set(hiddenNodes);
      const updatedHiddenEdges = new Set(hiddenEdges);
      const shouldHide = descendants.some((desc) => !hiddenNodes.has(desc.id));
      descendants.forEach((desc) => {
        if (shouldHide) {
          updatedHiddenNodes.add(desc.id);
        } else {
          updatedHiddenNodes.delete(desc.id);
        }
      });

      descendantEdges.forEach((edge) => {
        if (edge.hierarchical) {
          if (shouldHide) {
            updatedHiddenEdges.add(edge.id);
          } else {
            updatedHiddenEdges.delete(edge.id);
          }
        }
      });

      setHiddenNodes(updatedHiddenNodes);
      setHiddenEdges(updatedHiddenEdges);
      updateLayout();
    },
    [hiddenNodes, hiddenEdges, initialNodes, initialEdges, updateLayout]
  );

  const handleNodeClick = useCallback(
    (event, node) => {
      clickTimeoutRef.current = setTimeout(() => {
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

  const handleNodeDoubleClick = useCallback((event, node) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    doubleClickFlagRef.current = true;
    setSelectedNode(node);
    setActiveTab("details");
  }, []);

  // onEdgeClick: Skjul target-noden og dens etterkommere
  const handleEdgeClick = useCallback(
    (event, edge) => {
      const targetNode = initialNodes.find((n) => n.id === edge.target);
      if (targetNode) {
        const descendants = getDescendantNodes(targetNode, initialNodes, initialEdges);
        const updatedHiddenNodes = new Set(hiddenNodes);
        updatedHiddenNodes.add(targetNode.id);
        descendants.forEach((desc) => updatedHiddenNodes.add(desc.id));

        const descendantEdges = getDescendantEdges(targetNode, initialNodes, initialEdges);
        const updatedHiddenEdges = new Set(hiddenEdges);
        descendantEdges.forEach((e) => updatedHiddenEdges.add(e.id));

        setHiddenNodes(updatedHiddenNodes);
        setHiddenEdges(updatedHiddenEdges);
        updateLayout();
      }
    },
    [initialNodes, initialEdges, hiddenNodes, hiddenEdges, updateLayout]
  );

  // onConnect: Når en ny forbindelse lages manuelt
  const onConnect = useCallback(
    (params) => {
      const targetNode = nodeNetwork.nodes.find(
        (n) => String(n.nodeID) === params.target
      );
      let newEdge = {};
      if (targetNode && String(targetNode.parentID) === params.source) {
        newEdge = { ...params, animated: false, hierarchical: true };
      } else {
        newEdge = { ...params, animated: true, hierarchical: false };
      }
      setInitialEdges((eds) => addEdge(newEdge, eds));
    },
    [nodeNetwork]
  );

  const onNodesChange = useCallback(
    (changes) => {
      setInitialNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setInitialEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );

  // Når en ny aktør legges til via AddActor – forventer newActor: { nodeID, name, parentID, ... }
  const handleActorAdded = (newActor) => {
    setNodeNetwork((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newActor],
    }));
    setShowAddActorModal(false);
    updateLayout();
  };

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <ReactFlowProvider>
      <div className={styles.container}>
        <h2 className={styles.title}>{nodeNetwork.name || "Nettverk uten navn"}</h2>

        <div className={styles.searchBarContainer}>
          <SearchBar
            placeholder="Søk etter aktør"
            bgColor="#1A1A1A"
            width="25rem"
            enableDropdown={true}
            actors={nodeNetwork.nodes || []}
            onSelectActor={focusNode}  // Fokusfunksjonen som sentrerer kameraet på den valgte noden
            // onSearch={handleSearch}    // Om du ønsker live feedback
          />
        </div>

        <div className={styles.content}>
          <div className={styles.networkContainer}>
            <ReactFlow
              proOptions={proOptions}
              nodes={initialNodes}
              edges={initialEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              onNodeDoubleClick={handleNodeDoubleClick}
              onEdgeClick={handleEdgeClick}
              fitView
              style={{ width: "100%", height: "100%" }}
              panOnDrag
              zoomOnScroll
              zoomOnDoubleClick
              onInit={setReactFlowInstance}  // Fanger ReactFlow-instansen
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
                  <p>Fyll inn mer detaljer her...</p>
                  <button className={styles.deleteButton} onClick={handleDeleteNode}>
                    Slett node
                  </button>
                </div>
                          )}

                          {activeTab === "details" && !selectedNode && (
                              <>
                              <div>
                                  <h3>{nodeNetwork.name}</h3>
                                      <p>Status: {nodeNetwork.status}</p>

                                  <button
                                      className={styles.archiveButton}
                                      onClick={async () => {
                                          try {
                                              const res = await fetch(`https://localhost:5255/api/KHN/archive/${networkId}`, {
                                                  method: "POST",
                                              });
                                              if (res.ok) {
                                                  toast.success("Nettverket er arkivert!", {
                                                      position: "top-right",
                                                      autoClose: 3000,
                                                      hideProgressBar: false,
                                                      closeOnClick: true,
                                                      pauseOnHover: true,
                                                      draggable: true,
                                                  });
                                                  setTimeout(() => {
                                                      navigate("/nettverks-arkiv");
                                                  }, 2000);
                                              } else {
                                                  toast.error("Kunne ikke arkivere nettverket.");
                                              }
                                          } catch (err) {
                                              console.error("Error archiving network:", err);
                                              toast.error("Noe gikk galt...");
                                          }
                                      }}
                                  >
                                      Arkiver Nettverk
                                  </button>          


                                  <button
                                      className={styles.deleteNetworkButton}
                                      onClick={() => setShowDeleteConfirm(true)}
                                  >
                                      Slett Nettverk
                                  </button>
                                  </div>

                                  {showDeleteConfirm && (
                                      <div className={styles.confirmModal}>
                                          <p>Er du sikker på at du vil slette dette nettverket?</p>
                                          <button
                                              onClick={async () => {
                                                  try {
                                                      const res = await fetch(`https://localhost:5255/api/KHN/delete/${networkId}`, {
                                                          method: "DELETE",
                                                      });

                                                      if (res.ok) {
                                                          toast.success("Nettverket ble slettet!", {
                                                              position: "top-right",
                                                              autoClose: 3000,
                                                          });
                                                          setTimeout(() => {
                                                              navigate("/samvirke-nettverk");
                                                          }, 2000);
                                                      } else {
                                                          toast.error("Kunne ikke slette nettverket.");
                                                      }
                                                  } catch (err) {
                                                      console.error("Error deleting network:", err);
                                                  }
                                              }}
                                          >
                                              Ja, slett
                                          </button>

                                          <button onClick={() => setShowDeleteConfirm(false)}>
                                              Avbryt
                                          </button>
                                      </div>
                          )}
                      </>                             
)}

              {activeTab === "actors" && nodeNetwork.nodes && (
                <ul>
                  <button
                    className={styles.addActorButton}
                    onClick={() => setShowAddActorModal(true)}
                  >
                    + Ny Aktør
                  </button>
                  {nodeNetwork.nodes.map((node) => (
                    <button
                      key={node.nodeID}
                      className={styles.actorList}
                      onClick={() => focusNode(node)}
                    >
                      {node.name}
                    </button>
                  ))}
                </ul>
              )}
              {activeTab === "info" && (
                <p>Kritisk informasjon om nettverket og tilstand...</p>
              )}
            </div>
          </div>
        </div>
        <button className={styles.editButton}>Redigersmodus</button>
      </div>

      {showAddActorModal && (
        <AddActor
                  onClose={() => setShowAddActorModal(false)}
                  onActorAdded={handleActorAdded}
                  existingActors={nodeNetwork.nodes}
                  networkID={parseInt(networkId)}
        />
      )}
    </ReactFlowProvider>
  );
}

export default LiveKHN;