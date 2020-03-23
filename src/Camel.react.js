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

function Camel(props) {
  const { state } = useContext(CamelContext);
  const pos = state.gameState.camels[props.color];

  if (!pos) {
    return null;
  }

  return (
    <div className={'Camel ' + `camel-spot-${pos.spot}`}>
      {/* think we just gotta hardcode this one */}
      <div className="camel-y-offset" style={{ transform: 'translateY(' + (-pos.height * 30) + 'px)' }}>
        <img src={getCamel(props.color)} />
      </div>
    </div>
  );
}

export default Camel;
