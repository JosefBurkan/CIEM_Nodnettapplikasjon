import React, { useState, useEffect, useCallback, useRef } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./LiveNettverk.module.css";
import SearchBar from "../../../components/SearchBar/SearchBar.jsx";
import AddActor from "./AddActor.jsx";
import { useNodeNetworkData, useLayout, useScreenshotLogic, useCollapseExpand } from "../../../components/LiveNettverkComponents/Hooks.jsx"; // Korrigert sti
import NetworkGraph from "../../../components/LiveNettverkComponents/NetworkGraph.jsx";
import LiveInfoBox from "../../../components/LiveNettverkComponents/LiveInfoBox.jsx";
import {
    archiveNetworkAPI,
    deleteNetworkAPI,
} from "../../../components/LiveNettverkComponents/Api.js";

const LiveNettverk = () => {
    const navigate = useNavigate();
    const { networkId } = useParams();

    const { nodeNetwork, isReady, setNodeNetwork } = useNodeNetworkData(networkId);
    const [hiddenNodes] = useState(new Set());
    const [hiddenEdges] = useState(new Set());
    const { initialNodes, initialEdges, communicationEdges, setInitialNodes, setInitialEdges } = useLayout(nodeNetwork, hiddenNodes, hiddenEdges, "LR");
    const reactFlowWrapperRef = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    useScreenshotLogic(reactFlowInstance, isReady, networkId, reactFlowWrapperRef);

    const [activeTab, setActiveTab] = useState("actors");
    const [selectedNode, setSelectedNode] = useState(null);
    const [showAddActorModal, setShowAddActorModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
    const [addActorStep] = useState("choose");

    const { toggleCollapseExpand } = useCollapseExpand(initialNodes, initialEdges,  new Set(),  new Set(), useState(new Set())[0], useState(new Set())[0], setNodeNetwork, updateLayout);
    const combinedEdges = [...initialEdges, ...communicationEdges];
    const clickTimeoutRef = useRef(null);
    const doubleClickFlagRef = useRef(false);


      const updateLayout = useCallback(() => {
        if (nodeNetwork?.nodes) {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodeNetwork.nodes, combinedEdges, "LR");
            setInitialNodes(layoutedNodes);
            setInitialEdges(layoutedEdges.filter(e => e.hierarchical));
            setCommunicationEdges(layoutedEdges.filter(e => !e.hierarchical));
        }
    }, [nodeNetwork, combinedEdges]);

    useEffect(() => {
        if (networkId) {
            const loadNetwork = async() => {
                try{
                    const data = await fetchNodeNetwork(networkId);
                    setNodeNetwork(data);
                }
                catch(error){
                    console.error("Failed to fetch network", error);
                    toast.error("Failed to fetch network data");
                }
            }
            loadNetwork();
        }
    }, [networkId]);

    useEffect(() => {
        updateLayout();
    }, [nodeNetwork, updateLayout]);



    const handleShowAll = useCallback(() => {
        useState(new Set())[1](new Set());
        useState(new Set())[1](new Set());
        setSelectedNode(null);
        setActiveTab("actors");

        setTimeout(() => {
            if (reactFlowInstance) {
                reactFlowInstance.fitView();
            }
        }, 0);
    }, [reactFlowInstance]);

      const showPath = useCallback(
        (actor) => {
            if (!reactFlowInstance || !actor) return;
            const targetId = actor.id || String(actor.nodeID);

            const ancestors = [];
            let curr = nodeNetwork.nodes.find(n => String(n.nodeID) === targetId);
            while (curr?.parentID) {
                const pid = String(curr.parentID);
                ancestors.push(pid);
                curr = nodeNetwork.nodes.find(n => String(n.nodeID) === pid);
            }
            const pathIds = new Set([...ancestors, targetId]);

            useState(new Set())[1](new Set(
                initialNodes.map(n => n.id).filter(id => !pathIds.has(id))
            ));

            const visibleEdgeIds = nodeNetwork.nodes
                .filter(n =>
                    n.parentID != null &&
                    pathIds.has(String(n.nodeID)) &&
                    pathIds.has(String(n.parentID))
                )
                .map(n => `edge-${n.parentID}-${n.nodeID}`);

            useState(new Set())[1](new Set(
                combinedEdges.map(e => e.id).filter(id => !visibleEdgeIds.includes(id))
            ));

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
        [reactFlowInstance, nodeNetwork, initialNodes, combinedEdges, updateLayout]
    );

    const onConnect = useCallback(
        async (params) => {
            const targetNode = nodeNetwork.nodes.find(
                n => String(n.nodeID) === params.target
            );

            if (targetNode && String(targetNode.parentID) === params.source) {
                console.log("Hierarkisk edge - ignorer manuell oppretting");
            } else {
                try {
                    await connectNodesAPI(params.source, params.target);

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
                    toast.error("Failed to save connection.");
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
            setInitialEdges(eds => applyEdgeChanges(changes, eds));
        },
        []
    );

      const handleDeleteNode = useCallback(async () => {
        if (!selectedNode) return;
        const nodeIdToDelete = selectedNode.id;

        try {
            await deleteNodeFromAPI(selectedNode.id);

            setNodeNetwork(prev => {
                const updatedNodes = prev.nodes.filter(
                    n => String(n.nodeID) !== nodeIdToDelete
                );
                return { ...prev, nodes: updatedNodes };
            });
            setSelectedNode(null);

            setTimeout(() => {
                updateLayout();
            }, 0);
        } catch (error) {
             console.error("Failed to delete node", error);
             toast.error("Failed to delete node")
        }

    }, [selectedNode, updateLayout]);

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

      const handleEdgeClick = useCallback(
        (event, edge) => {
            const targetNode = initialNodes.find(n => n.id === edge.target);
            if (targetNode) {
                const descendants = getDescendantNodes(targetNode, initialNodes, initialEdges);
                const updatedHiddenNodes = new Set();
                updatedHiddenNodes.add(targetNode.id);
                descendants.forEach(desc => updatedHiddenNodes.add(desc.id));

                const descendantEdges = getDescendantEdges(targetNode, initialNodes, initialEdges);
                const updatedHiddenEdges = new Set();
                descendantEdges.forEach(e => updatedHiddenEdges.add(e.id));

                useState(new Set())[1](updatedHiddenNodes);
                useState(new Set())[1](updatedHiddenEdges);
                updateLayout();
            }
        },
        [initialNodes, initialEdges, updateLayout, getDescendantEdges, getDescendantNodes]
    );

    const handleActorAdded = (newActor) => {
        setNodeNetwork(prev => ({
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
                    <NetworkGraph
                        reactFlowWrapperRef={reactFlowWrapperRef}
                        initialNodes={initialNodes}
                        initialEdges={initialEdges}
                        communicationEdges={communicationEdges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={handleNodeClick}
                        onNodeDoubleClick={handleNodeDoubleClick}
                        onEdgeClick={handleEdgeClick}
                        setReactFlowInstance={setReactFlowInstance}
                    />
                    <LiveInfoBox
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        selectedNode={selectedNode}
                        showPath={showPath}
                        handleDeleteNode={handleDeleteNode}
                        nodeNetwork={nodeNetwork}
                        setShowAddActorModal={setShowAddActorModal}
                        showAddActorModal={showAddActorModal}
                        handleActorAdded={handleActorAdded}
                    />
                </div>

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

                {showArchiveConfirm && (
                    <div className={styles.confirmModal}>
                        <p>Er du sikker på at du vil arkivere dette nettverket?</p>
                        <button
                            onClick={async () => {
                                try {
                                    await archiveNetworkAPI(networkId);
                                    toast.success("Nettverket ble arkivert!", { position: "top-right", autoClose: 3000 });
                                    setTimeout(() => {
                                        navigate("/nettverks-arkiv");
                                    }, 2000);
                                } catch (err) {
                                    console.error("Error archiving network:", err);
                                    toast.error("Kunne ikke arkivere nettverket.");
                                }
                            }}
                        >
                            Ja, arkiver
                        </button>
                        <button onClick={() => setShowArchiveConfirm(false)}>Avbryt</button>
                    </div>
                )}

                {showDeleteConfirm && (
                    <div className={styles.confirmModal}>
                        <p>Er du sikker på at du vil slette dette nettverket?</p>
                        <button
                            onClick={async () => {
                                try {
                                    await deleteNetworkAPI(networkId);
                                    toast.success("Nettverket ble slettet!", { position: "top-right", autoClose: 3000 });
                                    setTimeout(() => {
                                        navigate("/samvirkeNettverk");
                                    }, 2000);
                                } catch (err) {
                                    console.error("Error deleting network:", err);
                                    toast.error("Kunne ikke slette nettverket.");
                                }
                            }}
                        >
                            Ja, slett
                        </button>
                        <button onClick={() => setShowDeleteConfirm(false)}>Avbryt</button>
                    </div>
                )}
            </div>
        </ReactFlowProvider>
    );
}

export default LiveNettverk;