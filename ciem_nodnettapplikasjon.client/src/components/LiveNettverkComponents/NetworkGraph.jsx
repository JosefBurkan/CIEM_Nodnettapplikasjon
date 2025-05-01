import React from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    MarkerType,
} from "@xyflow/react";

const NetworkGraph = ({
    reactFlowWrapperRef,
    initialNodes,
    initialEdges,
    communicationEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onNodeDoubleClick,
    onEdgeClick,
    setReactFlowInstance
}) => {
    return (
        <div className="networkContainer" ref={reactFlowWrapperRef}>
            <ReactFlow
                nodes={initialNodes}
                edges={[...initialEdges, ...communicationEdges]}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onNodeDoubleClick={onNodeDoubleClick}
                onEdgeClick={onEdgeClick}
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
    );
};

export default NetworkGraph;