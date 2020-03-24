import React, { useContext } from 'react';
import blueCamel from './images/camel-blue.png';
import greenCamel from './images/camel-green.png';
import orangeCamel from './images/camel-orange.png';
import yellowCamel from './images/camel-yellow.png';
import whiteCamel from './images/camel-white.png';
import { CamelContext } from './CamelContext';

const getCamel = color => {
  return {
    blue: blueCamel,
    green: greenCamel,
    orange: orangeCamel,
    yellow: yellowCamel,
    white: whiteCamel,
  }[color];
};

function CamelPlacing() {
  const { state } = useContext(CamelContext);

  const rankedCamels = Object.keys(state.gameState.camels).sort((a, b) => {
    const [ camelA, camelB ] = [ state.gameState.camels[a], state.gameState.camels[b] ];
    if (camelA.spot === camelB.spot) {
      return camelB.height - camelA.height;
    }

    return camelB.spot - camelA.spot;
  });

  return (
    <div className="CamelPlacing">
      <div className="CamelPlacingCamels">
        <div className="camel-col-placeholder" key="tim">
          <img src={blueCamel} />
        </div>
        {Object.keys(state.gameState.camels).map(
          // I should've been able to just render in the order of rankedCamels but key wasn't working for the transition :(
          (color) =>
            <div className="camel-col" key={color} style={{ transform: `translateX(calc(100% * ${rankedCamels.indexOf(color)}))` }}>
              <img src={getCamel(color)} alt={color} /> { /* I see you alok */ }
            </div>
        )}
      </div>
      <div className="CamelPlacingOrdinals">
        <div className="col">
          <h2>1st</h2>
        </div>
        <div className="col">
          <h2>2nd</h2>
        </div>
        <div className="col">
          <h2>3rd</h2>
        </div>
        <div className="col">
          <h2>4th</h2>
        </div>
        <div className="col">
          <h2>5th</h2>
        </div>
      </div>
    </div>
  );
}

export default CamelPlacing;
