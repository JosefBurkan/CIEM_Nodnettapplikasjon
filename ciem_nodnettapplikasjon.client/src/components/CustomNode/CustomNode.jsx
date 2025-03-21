import React from 'react';
import { Handle, Position } from 'reactflow';
import styles from './CustomNode.module.css';

const CustomNode = ({ data }) => {
    return (
        <div className={styles.nodeContainer}>
            <Handle type="target" position={Position.Top} />
            <div className={styles.nodeContent}>
                {data.label}
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default CustomNode; // ! ! !  fikk ikke dette til å funke enda, så bare ignorer  ! ! !  