import React, { useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  getOutgoers,
  Background,
  getConnectedEdges,
  MiniMap,
  Controls,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import styles from './CollapseExpand.module.css';

export const CollapseExpand = ({ onSelectNode }) => {
  const position = { x: 0, y: 0 };

const initialNodes = [
    { id: "1", data: { label: "KHN", beskrivelse: "Beskrivelse for KHN" }, position, className: styles.main },
    { id: "2", data: { label: "Nødetatene", beskrivelse: "Beskrivelse for Nødetatene" }, position, className: styles.second },
    { id: "3", data: { label: "HRS", beskrivelse: "Beskrivelse for HRS" }, position, className: styles.second },
    { id: "10", data: { label: "x", beskrivelse: "Beskrivelse for x" }, position, className: styles.second },
    { id: "4", data: { label: "Politi", beskrivelse: "Beskrivelse for Politi" }, position, className: styles.third },
    { id: "5", data: { label: "Brann", beskrivelse: "Beskrivelse for Brann" }, position, className: styles.third },
    { id: "6", data: { label: "Ambulanse" }, position, className: styles.third },
    { id: "7", data: { label: "y" }, position, className: styles.third },
    { id: "8", data: { label: "z" }, position, className: styles.third },
    { id: "11", data: { label: "æ" }, position, className: styles.third },
    { id: "12", data: { label: "ø" }, position, className: styles.third },
    { id: "9", data: { label: "å" }, position, className: styles.fourth },
    { id: "13", data: { label: "/" }, position, className: styles.fourth },
];

  const initialEdges = [
    { id: "1->2", source: "1", target: "2" },
    { id: "1->3", source: "1", target: "3" },
    { id: "2->4", source: "2", target: "4" },
    { id: "2->5", source: "2", target: "5" },
    { id: "2->6", source: "2", target: "6" },
    { id: "3->7", source: "3", target: "7" },
    { id: "3->8", source: "3", target: "8" },
    { id: "8->9", source: "8", target: "9" },
    { id: "1->10", source: "1", target: "10" },
    { id: "3->11", source: "3", target: "11" },
    { id: "3->12", source: "3", target: "12" },
    { id: "8->13", source: "8", target: "13" },
  ];

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const nodeWidth = 172;
  const nodeHeight = 36;
  const proOptions = { hideAttribution: true };

  const getLayoutedElements = (nodes, edges, direction = "LR") => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? "left" : "top";
      node.sourcePosition = isHorizontal ? "right" : "bottom";

      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    });

    return { nodes, edges };
  };

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const [hidden, setHidden] = useState(true);

  const hide = (hidden, childEdgeID, childNodeID) => (nodeOrEdge) => {
    if (
      childEdgeID.includes(nodeOrEdge.id) ||
      childNodeID.includes(nodeOrEdge.id)
    )
      nodeOrEdge.hidden = hidden;
    return nodeOrEdge;
  };

  const checkTarget = (edge, id) => {
    return edge.filter((ed) => ed.target !== id);
  };

  let outgoers = [];
  let connectedEdges = [];
  let stack = [];
  let clickTimeout = null;

  const handleNodeClick = (event, node) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      return;
    }

    clickTimeout = setTimeout(() => {
      // Expand/collapse on single click
      let currentNodeID = node.id;
      stack = [node];
      outgoers = [];
      connectedEdges = [];

      while (stack.length > 0) {
        let lastNode = stack.pop();
        let childNodes = getOutgoers(lastNode, nodes, edges);
        let childEdges = checkTarget(getConnectedEdges([lastNode], edges), currentNodeID);

        childNodes.forEach((goer) => {
          stack.push(goer);
          outgoers.push(goer);
        });
        childEdges.forEach((edge) => connectedEdges.push(edge));
      }

      const childNodeID = outgoers.map((node) => node.id);
      const childEdgeID = connectedEdges.map((edge) => edge.id);

      setNodes((nds) => nds.map(hide(hidden, childEdgeID, childNodeID)));
      setEdges((eds) => eds.map(hide(hidden, childEdgeID, childNodeID)));
      setHidden(!hidden);

      clickTimeout = null;
    }, 200);
  };

  const handleNodeDoubleClick = (event, node) => {
    clearTimeout(clickTimeout);
    clickTimeout = null;
    if (onSelectNode) {
      onSelectNode(node); // Send valgt node til LiveKHN
    }
  };

  return (
    <div className="layoutflow" style={{ height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        draggable={false}
        nodesConnectable={false}
        nodesDraggable={true}
        zoomOnScroll={true}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={true}
        panOnDrag={true}
        panOnScroll={false}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        attributionPosition="bottom-right"
        proOptions={proOptions}
      >
        <MiniMap pannable zoomable />
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default CollapseExpand;
