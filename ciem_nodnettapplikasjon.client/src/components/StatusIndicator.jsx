import React from 'react';

const StatusIndicator = ({ level }) => {
    const circleStyle = {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        marginRight: '3px',
        border: '1px solid #ccc',
    };

    const fillColor = (index, level) => {
        if (level === 0) return 'white';
        if (level === 1) return index === 0 ? 'red' : 'white';
        if (level === 2) return index < 2 ? 'yellow' : 'white';
        if (level === 3) return 'green';
        return 'white';
    };

    return (
        <div style={{ display: 'flex', marginTop: '5px' }}>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    style={{
                        ...circleStyle,
                        background: fillColor(i, level),
                        borderColor: level === 0 ? 'black' : '#ccc',
                    }}
                />
            ))}
        </div>
    );
};

export default StatusIndicator;
