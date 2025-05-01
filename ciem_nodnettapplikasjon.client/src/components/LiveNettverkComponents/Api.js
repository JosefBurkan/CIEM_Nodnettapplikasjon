export async function fetchNodeNetwork(networkId) {
    try {
        const response = await fetch(`https://localhost:5255/api/samvirkeNettverk/GetNodeNetwork/${networkId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch network data: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch node network:", error);
        throw error;
    }
}

export async function fetchInfoPanelData() {
    try {
        const response = await fetch("https://localhost:5255/api/InfoPanel/retrieveInfoPanel");
        if (!response.ok) {
            throw new Error(`Failed to fetch info panel data: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch info panel data:", error);
        throw error;
    }
}

export async function connectNodesAPI(sourceNodeId, targetNodeId) {
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

export async function archiveNetworkAPI(networkId) {
    try {
        const res = await fetch(`https://localhost:5255/api/samvirkeNettverk/archive/${networkId}`, {
            method: "POST",
        });
        if (!res.ok) {
            throw new Error("Failed to archive network");
        }
    } catch (err) {
        console.error("Error archiving network:", err);
        throw err;
    }
}

export async function deleteNetworkAPI(networkId) {
    try {
        const res = await fetch(`https://localhost:5255/api/samvirkeNettverk/delete/${networkId}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            throw new Error("Failed to delete network");
        }
    } catch (err) {
        console.error("Error deleting network:", err);
        throw err;
    }
}

export async function deleteNodeFromAPI(nodeId) {
    try {
        const response = await fetch(`https://localhost:5255/api/Nodes/delete/${nodeId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Failed to delete node: ${response.status}`);
        }
    } catch (error) {
        console.error("Failed to delete node:", error);
        throw error;
    }
}