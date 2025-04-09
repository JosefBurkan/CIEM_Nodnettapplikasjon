import React, { useEffect, useState } from "react";
import { ReactFlow, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import styles from "./LiveNetworkWidget.module.css";

function LiveNetworkPreview({ networkId }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://localhost:5255/api/KHN/GetNodeNetwork/${networkId}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error: ${res.status} - ${text}`);
        }

        const data = await res.json();
        console.log(`✅ Preview for networkId=${networkId}`, data);

        const layerCounts = new Map();
        const parsedNodes = data.nodes.map((node) => {
          const x = layerCounts.get(node.layer) || 0;
          layerCounts.set(node.layer, x + 1);

          return {
            id: String(node.nodeID),
            position: { x: x * 140, y: node.layer * 100 },
            data: { label: node.name },
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

    if (networkId) {
      setIsReady(false);
      fetchData();
    }
  }, [networkId]);

  if (!isReady) return <div className={styles.noData}>Laster forhåndsvisning...</div>;

  return (
    <div className={styles.flowPreview}>
      <ReactFlow
        key={`preview-${networkId}`}
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
