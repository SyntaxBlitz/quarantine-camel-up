import React, { useContext } from 'react';

import { CamelContext } from './CamelContext';

function Die(props) {
  const { state } = useContext(CamelContext);

  return (
    <div className={`Die ${props.color} ${state.viewState.savedDice.includes(props.color) ? '' : 'center'}`}>
      {state.gameState.dice[props.color]}
    </div>
  );
}

export default Die;
