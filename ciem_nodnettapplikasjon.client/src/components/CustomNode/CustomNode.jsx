import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import StatusIndicator from '../StatusIndicator';
import styles from './CustomNode.module.css';

const CustomNode = ({ id, data, selected }) => {
  const [editing, setEditing] = useState(false);
  const [inputLabel, setInputLabel] = useState(data.label);
  const [inputColor, setInputColor] = useState(data.color || "#ffffff");
  const [inputStatus, setInputStatus] = useState(
    typeof data.statusLevel === "number" ? data.statusLevel : 0
  );

  const finishEditing = () => {
    setEditing(false);
    if (data.onUpdate) {
      data.onUpdate(id, {
        label: inputLabel,
        color: inputColor,
        statusLevel: parseInt(inputStatus, 10),
      });
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') finishEditing();
  };

  return (
    <div
      className={styles.nodeContainer}
      style={{
        background: inputColor,
        border: selected ? "2px solid blue" : "1px solid #999",
      }}
      onDoubleClick={() => setEditing(true)}
    >
      {/* Tilkoblingshåndtakene er skjult med mindre noden er valgt */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: selected ? 1 : 0, zIndex: 10 }}
      />
      <div className={styles.nodeContent}>
        {editing ? (
          <div>
            <div className={styles.editRow}>
              <input
                type="text"
                value={inputLabel}
                onChange={(e) => setInputLabel(e.target.value)}
                onKeyDown={onKeyDown}
                autoFocus
                className={styles.input}
              />
              <button onClick={finishEditing} className={styles.closeButton}>X</button>
            </div>
            <div className={styles.editRow}>
              <label className={styles.label}>Farge:</label>
              <input
                type="color"
                value={inputColor}
                onChange={(e) => setInputColor(e.target.value)}
                className={styles.colorInput}
              />
            </div>
            <div className={styles.editRow}>
              <label className={styles.label}>Statusnivå:</label>
              <select
                value={inputStatus}
                onChange={(e) => setInputStatus(e.target.value)}
                className={styles.select}
              >
                <option value={0}>0 av 3 sirkler (svart)</option>
                <option value={1}>1 av 3 sirkler (rød)</option>
                <option value={2}>2 av 3 sirkler (gul)</option>
                <option value={3}>3 av 3 sirkler (grønn)</option>
              </select>
            </div>
          </div>
        ) : (
          <div>
            <strong>{data.label}</strong>
            <StatusIndicator level={data.statusLevel || 0} />
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: selected ? 1 : 0, zIndex: 10 }}
      />
    </div>
  );
};

export default CustomNode;
