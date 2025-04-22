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
import styles from "./LiveNettverk.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import AddActor from "./AddActor";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTemplateNodes } from "../../../components/TemplateHandler"; 
import { useScreenshot } from "use-react-screenshot"; // legg til øverst!

const proOptions = { hideAttribution: true };

// Gjett mal basert på navn
function guessTemplateFromName(name) {
  if (!name) return null;
  const loweredName = name.toLowerCase();
  if (loweredName.includes("trafikk") || loweredName.includes("ulykke")) return "trafikkulykke";
  if (loweredName.includes("flom")) return "flom";
  if (loweredName.includes("brann")) return "brann";
  return null;
}

// Auto-layout-funksjon
function getLayoutedElements(nodes, edges, direction = "TB") {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 180;
  const nodeHeight = 50;

  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodeSep: 80, edgeSep: 50 });

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

function LiveNettverk() {
  const navigate = useNavigate();
  const { networkId } = useParams();

  const [nodeNetwork, setNodeNetwork] = useState({});
  const [initialNodes, setInitialNodes] = useState([]);
  const [initialEdges, setInitialEdges] = useState([]);
  const [communicationEdges, setCommunicationEdges] = useState([]);
  const combinedEdges = [...initialEdges, ...communicationEdges];
  const [hiddenNodes, setHiddenNodes] = useState(new Set());
  const [hiddenEdges, setHiddenEdges] = useState(new Set());
  const [activeTab, setActiveTab] = useState("actors");
  const [selectedNode, setSelectedNode] = useState(null);
  const [showAddActorModal, setShowAddActorModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [addActorStep, setAddActorStep] = useState("choose");
  const [isReady, setIsReady] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [infoControl, setInfoControl] = useState([]);

  // Skriv kommentar her
  const [image, takeScreenshot] = useScreenshot();
  const reactFlowWrapperRef = useRef(null); 
  useEffect(() => {
    if (reactFlowInstance && isReady) {
      setTimeout(() => {
        if (reactFlowWrapperRef.current) {
          takeScreenshot(reactFlowWrapperRef.current).then((img) => {
            if (img && networkId) {
              localStorage.setItem(`screenshot-${networkId}`, img);
              console.log("Screenshot lagret!");
            }
          });
        }
      }, 1000); // Vente 1 sekund slik at grafen rekker å tegnes
    }
  }, [reactFlowInstance, isReady, networkId]);
  
  const clickTimeoutRef = useRef(null);
  const doubleClickFlagRef = useRef(false);

  // Fetch the network and all of its nodes
  const fetchSamvirkeNettverk = async () => {
    try {
      const response = await fetch(`https://localhost:5255/api/samvirkeNettverk/GetNodeNetwork/${networkId}`);
      const data = await response.json();
      console.log("Fetched data:", data);

      const templateName = data.template || guessTemplateFromName(data.name);

      if (data.nodes && data.nodes.length > 0) {
        setNodeNetwork(data);
      } else if (templateName) {
        const generatedNodes = getTemplateNodes(templateName).map((node, idx) => ({
          ...node,
          nodeID: node.id,
          name: node.data.label,
          parentID: null,
          connectionID: node.connectionID,
        }));

        setNodeNetwork({
          ...data,
          nodes: generatedNodes,
        });
      } else {
        setNodeNetwork(data);
      }

      setIsReady(true);
    } catch (error) {
      console.error("Failed to fetch node network:", error);
    }
  };

  useEffect(() => {
    if (networkId) fetchSamvirkeNettverk();
  }, [networkId]);

  // Fetch the 'Info Control' data
  const getInfoControl = async () =>
  {
    try
    {
      const response = await fetch("https://localhost:5255/api/infoControl/retrieveInfoControl");
      const data = await response.json();
      setInfoControl(data);
    }
    catch (error)
    {
      console.log(error);
    }
  }

  useEffect(() => {
    getInfoControl();
  }, [])

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
      .flatMap((n) => {
        const edgeList = [];
    
        // Generate manually created connection lines
        if (n.connectionID != null) {
          n.connectionID.forEach((connID) => {
            edgeList.push({
              id: `edge-${n.parentID}-${connID}`,
              source: String(n.nodeID),
              target: String(connID),
              animated: true,
            });
          });
        }

        // Generate automatically created connection lines 
        if (n.nodeID) {
          edgeList.push({
            id: `edge-${n.parentID}-${n.nodeID}`,
            source: String(n.parentID),
            target: String(n.nodeID),
            animated: false,
            hierarchical: true,
            hidden: hiddenEdges.has(`edge-${n.parentID}-${n.nodeID}`),
            style: { strokeWidth: 2.5, stroke: "#888" },
          });
        }
    
        return edgeList;
      });
    

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, "TB");
      setInitialNodes(layoutedNodes);
      setInitialEdges(layoutedEdges);
    }
  }, [nodeNetwork, hiddenNodes, hiddenEdges]);

  useEffect(() => {
    updateLayout();
  }, [nodeNetwork, hiddenNodes, hiddenEdges, updateLayout]);
  
  // API for sletting av en node
  const deleteNode = async (nodeID) => {

      // Sjekk om noden har underaktører
      const hasChildren = nodeNetwork.nodes.some(
        (n) => n.parentID !== null && String(n.parentID) === nodeID
      );

      if (hasChildren) { // Hvis noden har underaktører, kan den ikke slettes og error melding kommer.
        toast.error("Kan ikke slette en node som har underaktører.", {
          position: "top-center",
          autoClose: 2000,
        });
        return false;
      }
      try {
        const response = await fetch(`https://localhost:5255/api/Nodes/delete/${nodeID}`, {
          method: "DELETE",
        });
        if (response.ok) {
          console.log("Node deleted successfully");
          return true;
        } else {
          console.error("Failed to delete node:", await response.text());
          return false;
        }
      } catch (error) {
        console.error("Failed to delete node:", error);
        return false;
      }
  };

  useEffect(() => {
    if (networkId) fetchSamvirkeNettverk();
  }, [networkId]);

  // Fokusfunksjon for å sentrere kameraet til den valgte noden
  const focusNode = useCallback(
    (actor) => {
      if (!reactFlowInstance || !actor) return;
      console.log("Fokusere på actor:", actor);
      const node = initialNodes.find(n => n.id === String(actor.nodeID));
      if (!node) {
        console.log("Fant ikke node for actor:", actor);
        return;
      }
      
      const x = node.position.x + 90;
      const y = node.position.y + 25;
      reactFlowInstance.setCenter(x, y, 1.5);
      setActiveTab("details");
      setSelectedNode(node);
    },
    [reactFlowInstance, initialNodes]
  );


    // Knapp for å vise alle noder.
  const handleShowAll = useCallback(() => {
    setHiddenEdges(new Set());
    setHiddenNodes(new Set());
    setSelectedNode(null);
    setActiveTab("actors"); // Tilbakestill til aktør-fanen og null valgt node. Viser alle lukkede noder.

    setTimeout(() => {
        if (reactFlowInstance) {
            reactFlowInstance.fitView();
        }
    }, 0);
  }, [reactFlowInstance, updateLayout]);


  // Viser kun stien (ancestors + noden selv)
  const showPath = useCallback(
    (actor) => {
      if (!reactFlowInstance || !actor) return;
      const targetId = actor.id || String(actor.nodeID);
  
      // Finn alle ancestor-IDer
      const ancestors = [];
      let curr = nodeNetwork.nodes.find(n => String(n.nodeID) === targetId);
      while (curr?.parentID) {
        const pid = String(curr.parentID);
        ancestors.push(pid);
        curr = nodeNetwork.nodes.find(n => String(n.nodeID) === pid);
      }
      const pathIds = new Set([...ancestors, targetId]);
  
      // Skjul alt utenfor path
      setHiddenNodes(new Set(
        initialNodes.map(n => n.id).filter(id => !pathIds.has(id))
      ));
      const visibleEdgeIds = nodeNetwork.nodes
        .filter(n =>
          n.parentID != null &&
          pathIds.has(String(n.nodeID)) &&
          pathIds.has(String(n.parentID))
        )
        .map(n => `edge-${n.parentID}-${n.nodeID}`);
      setHiddenEdges(new Set(
        combinedEdges.map(e => e.id).filter(id => !visibleEdgeIds.includes(id))
      ));
  
      // Re-layout og sentrering
      updateLayout();
      setTimeout(() => {
        const node = initialNodes.find(n => n.id === targetId);
        if (!node) return;
        reactFlowInstance.setCenter(
          node.position.x + 90,
          node.position.y + 25,
          1.5
        );
        setActiveTab("details");
        setSelectedNode(node);
      }, 0);
    },
    [
      reactFlowInstance,
      nodeNetwork,
      initialNodes,
      combinedEdges,
      updateLayout
    ]
  );
  


  // onConnect: Når en ny forbindelse opprettes manuelt
  const onConnect = useCallback(
    async (params) => {
      // Sjekk om forbindelsen er hierarkisk basert på parentID
      const targetNode = nodeNetwork.nodes.find(
        (n) => String(n.nodeID) === params.target
      );
  

      if (targetNode && String(targetNode.parentID) === params.source) {
        console.log("Hierarkisk edge - ignorer manuell oppretting");
      } else {
        try {
          // Send data to "conenctionID"
          const response = await fetch("https://localhost:5255/api/nodes/connect", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              NodeID: params.source,
              ConnectionID: params.target,
            }),
          });
  
          if (!response.ok) {
            throw new Error("Failed to save connection");
          }
  
          // Dette er en manuell kommunikasjonsedge
          const newCommEdge = {
            ...params,
            animated: true,
            hierarchical: false,
            manual: true,
            style: { strokeWidth: 2 },
          };
          setCommunicationEdges(prev => addEdge(newCommEdge, prev));
        } catch (error) {
          console.error("Error saving connection:", error);
        }
      }
    },
    [nodeNetwork]
  );
  

  const onNodesChange = useCallback(
    (changes) => {
      setInitialNodes(nds => applyNodeChanges(changes, nds));
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes) => {
      // Her brukes combinedEdges hvis du ønsker å endre dem
      setInitialEdges(eds => applyEdgeChanges(changes, eds));
    },
    []
  );

  const handleDeleteNode = useCallback(async () => {
    if (!selectedNode) return;
    const nodeIdToDelete = selectedNode.id; 
    
    // Vent til deleteNode har kjørt
    const deletionSucceeded = await deleteNode(selectedNode.id);
    if (!deletionSucceeded) {
      // Hvis slettingen ikke ble gjennomført, stopp.
      return;
    }
    
    // Hvis slettingen var vellykket, oppdater UI – fjern noden fra nodeNetwork.nodes
    setNodeNetwork((prev) => {
      const updatedNodes = prev.nodes.filter(
        (n) => String(n.nodeID) !== nodeIdToDelete
      );
      return { ...prev, nodes: updatedNodes };
    });
    setSelectedNode(null);
  
    // Bruk en liten timeout for å sikre at stateoppdateringen er fullført før du kaller updateLayout
    setTimeout(() => {
      updateLayout();
    }, 0);
  }, [selectedNode, updateLayout]);
  
  // Hjelpefunksjoner for collapse/expand
  const getDescendantNodes = (node, allNodes, allEdges) => {
    const descendants = [];
    const visited = new Set();
    const stack = [node];
    while (stack.length > 0) {
      const current = stack.pop();
      const children = getOutgoers(current, allNodes, allEdges);

      children.forEach(child => {
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
    const descendantIds = descendantNodes.map(n => n.id);
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
      const shouldHide = descendants.some(desc => !hiddenNodes.has(desc.id));
      descendants.forEach(desc => {
        if (shouldHide) updatedHiddenNodes.add(desc.id);
        else updatedHiddenNodes.delete(desc.id);
      });
      descendantEdges.forEach(edge => {
        if (edge.hierarchical) {
          if (shouldHide) updatedHiddenEdges.add(edge.id);
          else updatedHiddenEdges.delete(edge.id);
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

  // onEdgeClick: Skjul target-node og dens etterkommere
  const handleEdgeClick = useCallback(
    (event, edge) => {
      const targetNode = initialNodes.find(n => n.id === edge.target);
      if (targetNode) {
        const descendants = getDescendantNodes(targetNode, initialNodes, initialEdges);
        const updatedHiddenNodes = new Set(hiddenNodes);
        updatedHiddenNodes.add(targetNode.id);
        descendants.forEach(desc => updatedHiddenNodes.add(desc.id));
  
        const descendantEdges = getDescendantEdges(targetNode, initialNodes, initialEdges);
        const updatedHiddenEdges = new Set(hiddenEdges);
        descendantEdges.forEach(e => updatedHiddenEdges.add(e.id));
  
        setHiddenNodes(updatedHiddenNodes);
        setHiddenEdges(updatedHiddenEdges);
        updateLayout();
      }
    },
    [initialNodes, initialEdges, hiddenNodes, hiddenEdges, updateLayout]
  );

  // Når en ny aktør legges til via AddActor
  const handleActorAdded = (newActor) => {
    setNodeNetwork(prev => ({
      ...prev,
      nodes: [...prev.nodes, newActor]
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
        onSelectActor={focusNode}
      />
    </div>

    <div className={styles.content}>
      <div className={styles.networkContainer} ref={reactFlowWrapperRef}>
        <ReactFlow
          proOptions={proOptions}
          nodes={initialNodes}
          edges={combinedEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          onEdgeClick={handleEdgeClick}
          fitView
          panOnDrag
          zoomOnScroll
          zoomOnDoubleClick
          onInit={setReactFlowInstance}
          style={{ width: "100%", height: "100%" }}
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
                onClick={async () => {
                  setActiveTab("info");
                }}
              >
            Infokontroll
          </button>
        </div>
          <div className={styles.tabContent}>
            {activeTab === "details" && selectedNode && (
              <div>
                <h3>{selectedNode.data.label}</h3>
                <p>{selectedNode.data.info}</p>
                <p>Fyll inn mer detaljer her...</p>

                <button
                  className={styles.showPathButton}
                  onClick={() => showPath(selectedNode)}
                  >
                    Vis sti
                </button>
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
                  onClick={() => {
                    setShowArchiveConfirm(true);
                    setShowDeleteConfirm(false);
                  }}
                >
                  Arkiver Nettverk
                </button>

                <button
                  className={styles.deleteNetworkButton}
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowArchiveConfirm(false);
                  }}
                >
                  Slett Nettverk
                </button>
              </div>

              {/* Archive Confirm Modal */}
              {showArchiveConfirm && (
                <div className={styles.confirmModal}>
                  <p>Er du sikker på at du vil arkivere dette nettverket?</p>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(`https://localhost:5255/api/KHN/archive/${networkId}`, {
                          method: "POST",
                        });
                        if (res.ok) {
                          toast.success("Nettverket ble arkivert!", { position: "top-right", autoClose: 3000 });
                          setTimeout(() => {
                            navigate("/nettverks-arkiv");
                          }, 2000);
                        } else {
                          toast.error("Kunne ikke arkivere nettverket.");
                        }
                      } catch (err) {
                        console.error("Error archiving network:", err);
                      }
                    }}
                  >
                    Ja, arkiver
                  </button>
                  <button onClick={() => setShowArchiveConfirm(false)}>Avbryt</button>
                </div>
              )}

              {/* Delete Confirm Modal */}
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
                          toast.success("Nettverket ble slettet!", { position: "top-right", autoClose: 3000 });
                          setTimeout(() => {
                            navigate("/samvirkeNettverk");
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
                  <button onClick={() => setShowDeleteConfirm(false)}>Avbryt</button>
                </div>
              )}
            </>
          )}

          {/* Aktører */}
          {activeTab === "actors" && nodeNetwork.nodes && (
            <ul>
              <button
                className={styles.addActorButton}
                onClick={() => {
                  setAddActorStep("choose");
                  setShowAddActorModal(true);
                }}
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

          {/* Info Kontroll */}
            {activeTab === "info" && (
                <div>
                  <p>HENSPE</p>
                {infoControl.map((info, index) => (
                  <p key={index}>
                    Hendelse: {info.eventName} <br/>
                    Eksakt posisjon: {info.exactPosition} <br/>
                    Nivå: {info.level} <br/>
                    Sikkerhet: {info.security} <br/>
                    Pasienter: {info.patients} <br/>
                    Evakuering: {info.evacuation} <br/>
                  </p>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>

    {/* AddActor Modal */}
    {showAddActorModal && (
      <AddActor
        onClose={() => setShowAddActorModal(false)}
        onActorAdded={handleActorAdded}
        existingActors={nodeNetwork.nodes}
        networkID={parseInt(networkId)}
      />
    )}
  </div>
</ReactFlowProvider>

  );
  
}
  
export default LiveNettverk;
