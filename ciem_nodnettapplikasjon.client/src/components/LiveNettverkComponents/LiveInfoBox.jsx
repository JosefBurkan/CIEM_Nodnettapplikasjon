import React from 'react';
import styles from "../../pages/SamvirkeNettverk/Live/LiveNettverk.module.css";
import AddActor from '../../pages/SamvirkeNettverk/Live/AddActor.jsx';
import { useInfoPanelData } from "./hooks.jsx";

const LiveInfoBox = ({
    activeTab,
    setActiveTab,
    selectedNode,
    showPath,
    handleDeleteNode,
    nodeNetwork,
    setShowAddActorModal,
    showAddActorModal,
    handleActorAdded
}) => {
    const infoPanel = useInfoPanelData();

    return (
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

                {activeTab === "actors" && nodeNetwork?.nodes && (
                    <ul>
                        <button
                            className={styles.addActorButton}
                            onClick={() => {
                                setShowAddActorModal(true);
                            }}
                        >
                            + Ny Aktør
                        </button>
                        {nodeNetwork.nodes.map(node => (
                            <button
                                key={node.nodeID}
                                className={styles.actorList}
                                onClick={() => {}}
                            >
                                {node.name}
                            </button>
                        ))}
                    </ul>
                )}

                {activeTab === "info" && (
                    <div>
                        <p>HENSPE</p>
                        {infoPanel.map((info, index) => (
                            <p key={index}>
                                Hendelse: {info.eventName} <br />
                                Eksakt posisjon: {info.exactPosition} <br />
                                Nivå: {info.level} <br />
                                Sikkerhet: {info.security} <br />
                                Pasienter: {info.patients} <br />
                                Evakuering: {info.evacuation} <br />
                            </p>
                        ))}
                    </div>
                )}
            </div>
             {showAddActorModal && (
                    <AddActor
                        onClose={() => setShowAddActorModal(false)}
                        onActorAdded={handleActorAdded}
                        existingActors={nodeNetwork.nodes}
                        networkID={parseInt(nodeNetwork.id)}
                    />
                )}
        </div>
    );
};

export default LiveInfoBox;