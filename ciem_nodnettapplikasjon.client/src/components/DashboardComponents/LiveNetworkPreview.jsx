import React, { useEffect, useState } from "react";
import { ReactFlow, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import styles from "./LiveNetworkWidget.module.css"; // <- Uses .flowPreview from here

function LiveNetworkPreview() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://localhost:5255/api/KHN/GetNodeNetwork/1");

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error: ${res.status} - ${text}`);
        }

        const data = await res.json();

        const layerCounts = new Map();
        const parsedNodes = data.nodes.map((node) => {
          const layer = Number.isFinite(node.layer) ? node.layer : 0;
          const xCount = layerCounts.get(layer) || 0;
          layerCounts.set(layer, xCount + 1);

          return {
            id: String(node.nodeID),
            position: {
              x: xCount * 140,
              y: layer * 100,
            },
            data: { label: node.name || "Ukjent node" },
            type: "default",
          };
        });

        const parsedEdges = data.nodes
          .filter((node) => node.targetNodeID)
          .map((node) => ({
            id: `e${node.targetNodeID}-${node.nodeID}`,
            source: String(node.targetNodeID),
            target: String(node.nodeID),
            animated: true,
          }));

        setNodes(parsedNodes);
        setEdges(parsedEdges);
        setIsReady(true);
      } catch (err) {
        console.error("Live preview fetch failed:", err.message);
      }
    };

    fetchData();
  }, []);

  if (!isReady) return <div>Laster forhåndsvisning...</div>;

  return (
    // ✅ This is the wrapper ReactFlow needs
    <div className={styles.flowPreview}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        panOnDrag={false}
        zoomOnScroll={false}
        nodesDraggable={false}
        elementsSelectable={false}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}

export default LiveNetworkPreview;
