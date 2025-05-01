import { useState, useEffect, useCallback } from 'react';
import { getOutgoers, addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import { toast } from "react-toastify";
import { supabase } from '../../utils/supabaseClient';

// --- Hjelpefunksjoner (kan flyttes til egen fil) ---

const guessTemplateFromName = (name) => {
    if (!name) return null;
    const loweredName = name.toLowerCase();
    if (loweredName.includes("trafikk") || loweredName.includes("ulykke")) return "trafikkulykke";
    if (loweredName.includes("flom")) return "flom";
    if (loweredName.includes("brann")) return "brann";
    return null;
};

const getLayoutedElements = (nodes, edges, direction = "TB") => {
    const hierEdges = edges.filter(e => e.hierarchical);
    const commEdges = edges.filter(e => !e.hierarchical);

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
};

async function fetchNodeNetwork(networkId) {
    try {
        const response = await fetch(`https://localhost:5255/api/samvirkeNettverk/GetNodeNetwork/${networkId}`);
        if (!response.ok) {
            console.error("Failed to fetch node network:", response.status);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch node network:", error);
        return null;
    }
}

async function fetchInfoPanelData() {
    try {
        const response = await fetch("https://localhost:5255/api/InfoPanel/retrieveInfoPanel");
        if (!response.ok) {
            console.error("Failed to fetch info panel data:", response.status);
            return [];
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch info panel data:", error);
        return [];
    }
}

async function connectNodesAPI(sourceNodeId, targetNodeId) {
     try {
        const response = await fetch("https://localhost:5255/api/nodes/connect", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                NodeID: sourceNodeId,
                ConnectionID: targetNodeId,
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to save connection");
        }
    } catch (error) {
        console.error("Error saving connection:", error);
        throw error;
    }
}

// --- Custom Hooks ---

export const useNodeNetworkData = (networkId) => {
    const [nodeNetwork, setNodeNetwork] = useState({});
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const loadNetworkData = async () => {
            if (networkId) {
                try {
                    const data = await fetchNodeNetwork(networkId);
                    if (data) {
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
                            setNodeNetwork({ ...data, nodes: generatedNodes });
                        } else {
                            setNodeNetwork(data);
                        }
                        setIsReady(true);
                    }
                } catch (error) {
                    console.error("Error loading network data:", error);
                    toast.error("Failed to load network data.");
                    setIsReady(false);
                }
            }
        };
        loadNetworkData();
    }, [networkId]);

    return { nodeNetwork, isReady, setNodeNetwork };
};

export const useInfoPanelData = () => {
    const [infoPanel, setInfoPanel] = useState([]);

    useEffect(() => {
        const getInfo = async () => {
            try {
                const data = await fetchInfoPanelData();
                setInfoPanel(data);
            } catch (error) {
                console.error("Error fetching info panel data", error);
                toast.error("Failed to load info panel data.");
            }
        };

        getInfo();

        const channel = supabase
            .channel('InfoPanel-db-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'InfoPanel' },
                (payload) => {
                    getInfo();
                    console.log(payload);
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    return infoPanel;
};

export const useLayout = (nodesData, hiddenNodes, hiddenEdges, direction = "LR") => {
    const [initialNodes, setInitialNodes] = useState([]);
    const [initialEdges, setInitialEdges] = useState([]);
    const [communicationEdges, setCommunicationEdges] = useState([]);

    useEffect(() => {
        if (nodesData && nodesData.nodes) {
            const nodes = nodesData.nodes.map((node) => ({
                id: String(node.nodeID),
                data: { label: node.name, info: `Detaljert info om ${node.name}` },
                hidden: hiddenNodes.has(String(node.nodeID)),
                position: { x: 0, y: 0 },
                sourcePosition: 'right',
                targetPosition: 'left',
            }));

            const allEdges = nodesData.nodes.flatMap(node => {
                const edges = [];

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

                (node.connectionID || []).forEach(connID => {
                    edges.push({
                        id: `comm-${node.nodeID}-${connID}`,
                        source: String(node.nodeID),
                        target: String(connID),
                        hierarchical: false,
                        animated: true,
                        markerEnd: { type: MarkerType.ArrowClosed },
                        markerStart: { type: MarkerType.ArrowClosed, orient: 'auto-start-reverse' },
                        style: { strokeWidth: 1.5, strokeDasharray: "4 2" },
                    });
                });
                return edges;
            });

            const { nodes: layoutedNodes, edges: layoutedAllEdges } = getLayoutedElements(nodes, allEdges, direction);

            setInitialNodes(layoutedNodes);
            setInitialEdges(layoutedAllEdges.filter(e => e.hierarchical));
            setCommunicationEdges(layoutedAllEdges.filter(e => !e.hierarchical));
        }
    }, [nodesData, hiddenNodes, hiddenEdges, direction]);

    return { initialNodes, initialEdges, communicationEdges, setInitialNodes, setInitialEdges };
};

export const useScreenshotLogic = (reactFlowInstance, isReady, networkId, reactFlowWrapperRef) => {
    const [, takeScreenshot] = useScreenshot();

    useEffect(() => {
        if (reactFlowInstance && isReady && networkId && reactFlowWrapperRef.current) {
            const timer = setTimeout(() => {
                takeScreenshot(reactFlowWrapperRef.current).then((img) => {
                    if (img) {
                        localStorage.setItem(`screenshot-${networkId}`, img);
                        console.log("Screenshot lagret!");
                    }
                });
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [reactFlowInstance, isReady, networkId,  takeScreenshot, reactFlowWrapperRef]);
};

export const useCollapseExpand = (
    initialNodes,
    initialEdges,
    hiddenNodes,
    hiddenEdges,
    setHiddenNodes,
    setHiddenEdges,
    setNodeNetwork,
    updateLayout
) => {
    const getDescendantNodes = useCallback(
        (node, allNodes, allEdges) => {
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
        },
        [getOutgoers]
    );

    const getDescendantEdges = useCallback(
        (node, allNodes, allEdges) => {
            const descendantNodes = getDescendantNodes(node, allNodes, allEdges);
            const descendantIds = descendantNodes.map(n => n.id);
            return allEdges.filter(
                (edge) => descendantIds.includes(edge.source) || descendantIds.includes(edge.target)
            );
        },
        [getDescendantNodes]
    );

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
        [getDescendantEdges, getDescendantNodes, hiddenEdges, hiddenNodes, setHiddenEdges, setHiddenNodes, setNodeNetwork, updateLayout, initialEdges, initialNodes]
    );

    return { toggleCollapseExpand };
};

export const useNodeChanges = (initialNodes, initialEdges, setInitialNodes, setInitialEdges) => {
    const onNodesChange = useCallback((changes) => {
        setInitialNodes((nds) => applyNodeChanges(changes, nds));
    }, [setInitialNodes]);

    const onEdgesChange = useCallback((changes) => {
        setInitialEdges((eds) => applyEdgeChanges(changes, eds));
    }, [setInitialEdges]);

    return { onNodesChange, onEdgesChange };
};