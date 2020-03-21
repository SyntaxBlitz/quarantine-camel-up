import React from 'react';

import blueCamel from './camel-blue.png';
import greenCamel from './camel-green.png';
import orangeCamel from './camel-orange.png';
import yellowCamel from './camel-yellow.png';
import whiteCamel from './camel-white.png';

const getCamel = color => {
  return {
    blue: blueCamel,
    green: greenCamel,
    orange: orangeCamel,
    yellow: yellowCamel,
    white: whiteCamel,
  }[color];
}

function Camel(props) {
  return (
    <div className={'Camel ' + `spot-${props.spot}`}>
      {/* think we just gotta hardcode this one */}
      <div className="camel-y-offset" style={{ transform: 'translateY(' + (-props.height * 30) + 'px)' }}>
        <img src={getCamel(props.color)} />
      </div>
    </div>
  );
}

export default Camel;
