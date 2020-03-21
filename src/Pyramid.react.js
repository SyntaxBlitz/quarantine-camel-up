import React from 'react';
import pyramidSide from './pyramid-side.png';

function Pyramid() {
  return (
    <div className="Pyramid">
      <img src={pyramidSide} className="back" />
      <img src={pyramidSide} className="front" />
      <img src={pyramidSide} className="left" />
      <img src={pyramidSide} className="right" />
    </div>
  );
}

export default Pyramid;
