import React, { useState } from 'react';
import Camel from './Camel.react'

function Camels() {
  const [ spots, setSpots ] = useState({
    blue: { spot: 1, height: 0 },
    yellow: { spot: 2, height: 0 },
    orange: { spot: 3, height: 0 },
    white: { spot: 4, height: 0 },
    green: { spot: 5, height: 0 },
  });
  window.setSpots = setSpots;

  return (
    <div className="Camels">
      <Camel color="blue" spot={spots.blue.spot} height={spots.blue.height} />
      <Camel color="yellow" spot={spots.yellow.spot} height={spots.yellow.height} />
      <Camel color="orange" spot={spots.orange.spot} height={spots.orange.height} />
      <Camel color="white" spot={spots.white.spot} height={spots.white.height} />
      <Camel color="green" spot={spots.green.spot} height={spots.green.height} />
    </div>
  );
}

export default Camels;
