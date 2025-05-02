// This file contains the LiveNetwork component which is used to display and manage the live network of nodes and edges
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
  MarkerType,
} from "@xyflow/react";
import dagre from "dagre";
import "@xyflow/react/dist/style.css";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./LiveNetwork.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import AddActor from "./AddActor"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTemplateNodes } from "../../../components/TemplateHandler"; 
import { useScreenshot } from "use-react-screenshot"; 
import { supabase } from '../../../utils/supabaseClient'; 

const proOptions = { hideAttribution: true };

// guessTemplateFromName-function to guess the template name based on the network name
// this is not complete, we didnt have time to implement it fully
// it is a placeholder for now, and should be improved in the future
function guessTemplateFromName(name) {
  if (!name) return null;
  const loweredName = name.toLowerCase();
  if (loweredName.includes("trafikk") || loweredName.includes("ulykke")) return "trafikkulykke";
  if (loweredName.includes("flom")) return "flom";
  if (loweredName.includes("brann")) return "brann";
  return null;
}

// A function to get the layouted elements using dagre
function getLayoutedElements(nodes, edges, direction = "TB") {
  const hierEdges = edges.filter(e => e.hierarchical);
  const commEdges = edges.filter(e => !e.hierarchical);
 
  // Create a new directed graph using dagre
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodeSep: 30, edgeSep: 50 });

  const nodeWidth = 180;
  const nodeHeight = 50;
  nodes.forEach((node) => {
    if (!node.hidden) {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    }
  });

  hierEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Set the position of each node based on the layout
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
  const layoutedHierEdges = hierEdges.map(edge => ({
    ...edge,
  }));

  return { 
    nodes: layoutedNodes, 
    edges: [...layoutedHierEdges, ...commEdges],
  };
}
// Main component for the live network
function LiveNetwork() {
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
  const [InfoPanel, setInfoPanel] = useState([]);

  // Takes a screenshot of the network and saves it to localStorage
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
      }, 1000); // Delay to ensure the screenshot is taken after the layout is updated
    }
  }, [reactFlowInstance, isReady, networkId]);
  
  const clickTimeoutRef = useRef(null);
  const doubleClickFlagRef = useRef(false);
  // Fetch the network and all of its nodes
  const fetchNodeNetworks = async () => {
    try {
      const response = await fetch(`https://localhost:5255/api/NodeNetworks/GetNodeNetwork/${networkId}`); // Fetch the network data
      const data = await response.json();
      console.log("Fetched data:", data);
       
      // Check if the response is valid and contains nodes
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
    if (networkId) fetchNodeNetworks();
  }, [networkId]);

  
  // This function fetches the info panel data from the API and sets it in the state
  const getInfoPanel = async () =>
  {
    try
    {
      const response = await fetch("https://localhost:5255/api/InfoPanel/retrieveInfoPanel");
      const data = await response.json();
      setInfoPanel(data);
    }
    catch (error)
    {
      console.log(error);
    }
  }
 // Function to update the layout of the nodes and edges
// This function uses the dagre library to layout the nodes and edges in a hierarchical manner
  const updateLayout = useCallback(() => {
    if (!nodeNetwork?.nodes) return;

    const categoryColors = {
      statlige:   "#87ceeb80",
      private:    "#90ee9080",
      frivillige: "#ff7f5080",
    };
      const nodes = nodeNetwork.nodes.map((node) => {
        const id      = String(node.nodeID);
        const typeRaw = node.type     || "";
        const catRaw  = node.category || "";
    
        // Sjekk om det er en organisasjon
        const isOrg = /organisasjon|selskap/i.test(typeRaw);
        // Finn bakgrunnsfarge ut fra category (eller hvit som fallback)
        const bgColor = categoryColors[catRaw.toLowerCase()] || "#fff";
  
        const style = {
          backgroundColor: bgColor,
          border:          `2px ${isOrg ? "dashed" : "solid"} #000`,
          borderRadius:    10,
          padding:         18,
        };
    
        return {
          id,
          data: {
            label: node.name,
            info:  `Detaljert info om ${node.name}`,
            beskrivelse: ``,
          },
          hidden:         hiddenNodes.has(id),
          position:       { x: 0, y: 0 },
          sourcePosition: "right",
          targetPosition: "left",
          style,
        };
      });
  
      const allEdges = nodeNetwork.nodes.flatMap(node => {
        const edges = [];
      
        // Add hierarchical edges
        // These edges are used to represent the parent-child relationship between nodes
        if (node.parentID != null && node.parentID !== 0) {
          edges.push({
            id: `edge-${node.parentID}-${node.nodeID}`,
            source: String(node.parentID),
            target: String(node.nodeID),
            hierarchical: true,
            hidden: hiddenEdges.has(`edge-${node.parentID}-${node.nodeID}`),
            animated: false,
            style: { strokeWidth: 2.5, stroke: "#888" },
          });
        }
  
        // Add communication edges
        // These edges are not hierarchical and are used for communication between nodes
        (node.connectionID || []).forEach(connID => {
          edges.push({
            id: `comm-${node.nodeID}-${connID}`,
            source: String(node.nodeID),
            target: String(connID),
            hierarchical: false,
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            markerStart: {
              type: MarkerType.ArrowClosed,
              orient: 'auto-start-reverse',
            },
            style: { strokeWidth: 1.5, strokeDasharray: "4 2" },
          });
        });
  
        return edges;
      });
      
      // Filter out hidden edges
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, allEdges, "LR");
    
      setInitialNodes(layoutedNodes);
      setInitialEdges(layoutedEdges.filter((e) => e.hierarchical));
      setCommunicationEdges(layoutedEdges.filter((e) => !e.hierarchical));
    }, [nodeNetwork, hiddenNodes, hiddenEdges]);



  
  // API call to delete a node
  // This function checks if the node has children before deleting it
  const deleteNode = async (nodeID) => {

      // Check if the node has children
      const hasChildren = nodeNetwork.nodes.some(
        (n) => n.parentID !== null && String(n.parentID) === nodeID
      );

      if (hasChildren) { // If the node has children, show an error message
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
 
  // Fetch the node network when the component mounts or when networkId changes
  // This function fetches the node network data from the API and sets it in the state
  useEffect(() => {
    if (networkId) fetchNodeNetworks();
  }, [networkId]);

  // Focus on a specific node when it is selected from the search bar
  // This function sets the center of the react flow instance to the position of the selected node
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


  // This function subscribes to the database for real-time updates and fetches the data when changes occur
  // It uses the supabase client to listen for changes in the InfoPanel table and updates the state accordingly
  useEffect(() => {
    getInfoPanel();
    supabase
        .channel('InfoPanel-db-changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'InfoPanel',
            },
            (payload) => {
              getInfoPanel();
              console.log(payload);
            }
        )
        .subscribe();
  }, []);

 
  // This function updates the layout of the nodes and edges based on the current state
  useEffect(() => {
    updateLayout();
  }, [nodeNetwork, hiddenNodes, hiddenEdges]);

  // This function subscribes to the database for real-time updates and fetches the data when changes occur
  useEffect(() => {
    supabase
        .channel('nodes-db-changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'Nodes',
            },
            async (payload) => {
              console.log("Change registrered");
              const updatedNetwork = await fetchNodeNetworks();
              setNodeNetwork([...updatedNetwork]); // Update the nodeNetwork state with the new data
              updateLayout();
            }
        )
        .subscribe();
  }, []);

    // Subscribe for node-network updates
  const handleShowAll = useCallback(() => {
    setHiddenEdges(new Set());
    setHiddenNodes(new Set());
    setSelectedNode(null);
    setActiveTab("actors"); // Reset active tab to "actors"

    setTimeout(() => {
        if (reactFlowInstance) {
            reactFlowInstance.fitView();
        }
    }, 0);
  }, [reactFlowInstance, updateLayout]);


  // This function shows the path from the selected node to its ancestors
  const showPath = useCallback(
    (actor) => {
      if (!reactFlowInstance || !actor) return;
      const targetId = actor.id || String(actor.nodeID);

      // Finds the path to the root node
      // and stores the ids in a set for easy lookup
      const ancestors = [];
      let curr = nodeNetwork.nodes.find(n => String(n.nodeID) === targetId);
      while (curr?.parentID) {
        const pid = String(curr.parentID);
        ancestors.push(pid);
        curr = nodeNetwork.nodes.find(n => String(n.nodeID) === pid);
      }
      const pathIds = new Set([...ancestors, targetId]);

      // Set the hidden nodes and edges based on the path
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

      // Update the layout and set the selected node
      // to the target node after a short delay
      updateLayout();
      setTimeout(() => {
        if (reactFlowInstance) {
          reactFlowInstance.fitView();
        }
        setActiveTab("details");
        const node = initialNodes.find(n => n.id === targetId);
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

  // This function handles the connection between nodes
  // It checks if the connection is hierarchical based on the parentID
  const onConnect = useCallback(
    async (params) => {
     
      const targetNode = nodeNetwork.nodes.find(
        (n) => String(n.nodeID) === params.target
      );
  

      if (targetNode && String(targetNode.parentID) === params.source) {
        console.log("Hierarkisk edge - ignorer manuell oppretting");
      } else {
        try {
          // API call to save the connection
          // This function sends a PUT request to the API to save the connection between nodes
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
  
          // If the connection is saved successfully, add the edge to the state
          const newCommEdge = {
            ...params,
            animated: true,
            hierarchical: false,
            manual: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            markerStart: {
              type: MarkerType.ArrowClosed,
              orient: 'auto-start-reverse',
            },
            style: { strokeWidth: 1.5 },
          };
          setCommunicationEdges(prev => addEdge(newCommEdge, prev));
        } catch (error) {
          console.error("Error saving connection:", error);
        }
      }
    },
    [nodeNetwork]
  );
  
  // This function handles the changes in nodes
  const onNodesChange = useCallback(
    (changes) => {
      setInitialNodes(nds => applyNodeChanges(changes, nds));
    },
    []
  );
 // This function handles the changes in edges
  // It uses the applyEdgeChanges function to update the edges based on the changes
  const onEdgesChange = useCallback(
    (changes) => {
      
      setInitialEdges(eds => applyEdgeChanges(changes, eds));
    },
    []
  );
 // This function handles the deletion of a node
  // It checks if the node has children before deleting it
  const handleDeleteNode = useCallback(async () => {
    if (!selectedNode) return;
    const nodeIdToDelete = selectedNode.id; 
    
    // Check if the node has children
    const deletionSucceeded = await deleteNode(selectedNode.id);
    if (!deletionSucceeded) {
      
      return;
    }
    
    // If the deletion is successful, remove the node from the state
    // and update the layout
    setNodeNetwork((prev) => {
      const updatedNodes = prev.nodes.filter(
        (n) => String(n.nodeID) !== nodeIdToDelete
      );
      return { ...prev, nodes: updatedNodes };
    });
    setSelectedNode(null);
  
    // Use setTimeout to ensure the layout is updated after the state change
    // This is a workaround to ensure the layout is updated after the state change
    // and the React Flow instance is ready
    // This is necessary because React Flow does not update the layout immediately after state changes
    setTimeout(() => {
      updateLayout();
    }, 0);
  }, [selectedNode, updateLayout]);
  
  // Helper functions to get descendant nodes and edges
  // These functions are used to get the descendants of a node in the network
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
  // This function gets the descendant edges of a node in the network
  // It filters the edges based on the descendant nodes
  const getDescendantEdges = (node, allNodes, allEdges) => {
    const descendantNodes = getDescendantNodes(node, allNodes, allEdges);
    const descendantIds = descendantNodes.map(n => n.id);
    return allEdges.filter(
      (edge) => descendantIds.includes(edge.source) || descendantIds.includes(edge.target)
    );
  };

  // This function toggles the collapse/expand state of a node
  // It hides or shows the descendants of the node based on the current state
  const toggleCollapseExpand = useCallback(
    (node) => {
      const descendants     = getDescendantNodes(node, initialNodes, initialEdges);
      const descendantEdges = getDescendantEdges(node, initialNodes, initialEdges);
      const updatedHiddenNodes = new Set(hiddenNodes);
      const updatedHiddenEdges = new Set(hiddenEdges);
      const shouldHide = descendants.some(desc => !hiddenNodes.has(desc.id));
  
      descendants.forEach(desc => {
        if (shouldHide) updatedHiddenNodes.add(desc.id);
        else            updatedHiddenNodes.delete(desc.id);
      });
      descendantEdges.forEach(edge => {
        if (edge.hierarchical) {
          if (shouldHide) updatedHiddenEdges.add(edge.id);
          else            updatedHiddenEdges.delete(edge.id);
        }
      });
  
      setHiddenNodes(updatedHiddenNodes);
      setHiddenEdges(updatedHiddenEdges);
  
      // Update the node name to show the number of descendants
      // This is done by checking if the node name already contains a count
      const count = descendants.length;
      setNodeNetwork(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => {
          if (String(n.nodeID) !== node.id) return n;
          const base = n.name.includes(' (') ? n.name.split(' (')[0] : n.name;
          return {
            ...n,
            name: shouldHide ? `${base} (${count})` : base,
          };
        }),
      }));
      updateLayout();
    },
    [hiddenNodes, hiddenEdges, initialNodes, initialEdges, updateLayout]
  );
  
 // This function handles the click event on a node
// It toggles the collapse/expand state of the node based on the click type (single or double click)
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
 
  // This function handles the double click event on a node
  // It clears the click timeout and sets the selected node to show its details
  const handleNodeDoubleClick = useCallback((event, node) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    doubleClickFlagRef.current = true;
    setSelectedNode(node);
    setActiveTab("details");
  }, []);

  // onEdgeClick: Handles the click event on an edge
  // It hides the target node and its descendants when clicked
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

  // This function handles the addition of a new actor to the network
  // It updates the node network state and closes the modal
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
  
  // Render the live network component
  // It includes the search bar, network visualization, and info panel
  // The search bar allows the user to search for actors in the network
  // The network visualization shows the nodes and edges in a hierarchical layout
  // The info panel shows the details of the selected node and allows the user to add new actors
  // The component also includes buttons to archive or delete the network
  // and a confirmation modal for these actions
  return (
    <ReactFlowProvider>
  <div className={styles.container}>
    <h2 className={styles.title}>{nodeNetwork?.name || "Nettverk uten navn"}</h2>
    
    <div className={styles.searchBarContainer}>
      <SearchBar
        placeholder="Søk etter aktør"
        bgColor="#1A1A1A"
        width="25rem"
        enableDropdown={true}
        actors={nodeNetwork?.nodes || []}
        onSelectActor={focusNode}
      />
      <button className={styles.showAllButton} onClick={handleShowAll}>
        Vis hele nettverket
      </button>
    </div>

    <div className={styles.content}>
      <div className={styles.networkContainer} ref={reactFlowWrapperRef}>
        <ReactFlow
          proOptions={proOptions}
          nodes={initialNodes}
          edges={[...initialEdges, ...communicationEdges]}
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
            {/* Details */}
            Detaljer
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "actors" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("actors")}
          >
            {/* Actors */}
            Aktører
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "info" ? styles.activeTab : ""}`}
                onClick={async () => {
                  setActiveTab("info");
                }}
              >
            {/* InfoControll */}
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
                                  </div>
                              </>
                          )}
             {/* Show the list of actors in the network */}
            {activeTab === "actors" && nodeNetwork?.nodes && (
              <ul>
                <button
                  className={styles.addActorButton}
                  onClick={() => {
                    setAddActorStep("choose");
                    setShowAddActorModal(true);
                  }}
                >
                  {/* Add Actor */}
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
            {/* Show the info panel */}
            {/* This section displays the info panel data fetched from the API */}
            {activeTab === "info" && (
                <div>
                  <p>HENSPE</p>
                {InfoPanel.map((info, index) => (
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

    {/* Add Actor Modal */}
    {/* This modal is shown when the user clicks on the "Add Actor" button */}
    {showAddActorModal && (
      <AddActor
        onClose={() => setShowAddActorModal(false)}
        onActorAdded={handleActorAdded}
        existingActors={nodeNetwork.nodes}
        networkID={parseInt(networkId)}
      />
                  )}

  
                  <div className={styles.fixedBottomRight}>
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
                  
                  {/* Confirmation Modals for Archive and Delete actions */}
                  {/* These modals are shown when the user clicks on the "Archive Network" or "Delete Network" buttons */}
                  {showArchiveConfirm && (
                      <div className={styles.confirmModal}>
                          <p>Er du sikker på at du vil arkivere dette nettverket?</p>
                          <button
                              onClick={async () => {
                                  try {
                                      const res = await fetch(`https://localhost:5255/api/NodeNetworks/archive/${networkId}`, {
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
                  {/* Delete Confirmation Modal */}
                  {/* This modal is shown when the user clicks on the "Delete Network" button */}
                  {showDeleteConfirm && (
                      <div className={styles.confirmModal}>
                          <p>Er du sikker på at du vil slette dette nettverket?</p>
                          <button
                              onClick={async () => {
                                  try {
                                      const res = await fetch(`https://localhost:5255/api/NodeNetworks/delete/${networkId}`, {
                                          method: "DELETE",
                                      });
                                      if (res.ok) {
                                          toast.success("Nettverket ble slettet!", { position: "top-right", autoClose: 3000 });
                                          setTimeout(() => {
                                              navigate("/NodeNetworks");
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
                  </div>
</ReactFlowProvider >
  );
}
    
  
export default LiveNetwork;
