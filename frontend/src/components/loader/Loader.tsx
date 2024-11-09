import React from 'react';
import './loader.css';

const Loader = ({ height = 100 }) => {
    return (
        <div className="lds-center" style={{ height: `${height}vh` }}>
            <div className="lds-dual-ring"></div>
        </div>
    );
};

export default Loader;
