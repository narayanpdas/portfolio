import React from 'react';

const Loader: React.FC<{ size?: number }> = ({ size = 120 }) => {
    // size controls the visual scale of the cubes container
    const style: React.CSSProperties = {
        width: size,
        height: size,
    };

    return (
        <div className="page-loader" role="status" aria-live="polite">
            <div className="loop cubes" style={style}>
                <div className="item cubes" />
                <div className="item cubes" />
                <div className="item cubes" />
                <div className="item cubes" />
                <div className="item cubes" />
                <div className="item cubes" />
            </div>
        </div>
    );
};

export default Loader;
