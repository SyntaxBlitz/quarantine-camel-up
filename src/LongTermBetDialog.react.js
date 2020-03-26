import React, { useContext } from 'react';
import { LocalContext } from './LocalContext';
import blueCamel from './images/camel-blue.png';
import greenCamel from './images/camel-green.png';
import orangeCamel from './images/camel-orange.png';
import yellowCamel from './images/camel-yellow.png';
import whiteCamel from './images/camel-white.png';
import { CamelContext } from './CamelContext';
import { placeLongTermBet } from './comms';

const getCamel = color => {
  return {
    blue: blueCamel,
    green: greenCamel,
    orange: orangeCamel,
    yellow: yellowCamel,
    white: whiteCamel,
  }[color];
};

function LongTermBetDialog() {
  const { state } = useContext(CamelContext);
  const { localState, localDispatch } = useContext(LocalContext);

  const placeBet = color => {
    placeLongTermBet(localState.lastLongTermBettingOn)(color);
    localDispatch({ type: 'CLOSE_LONG_TERM_BET_DIALOG' });
  };

  return (
    <>
      <div className={`BackdropFilter ${(!localState.longTermBetDialogShown) ? 'hidden' : ''}`} />
      <div className={`LongTermBetDialog ${(!localState.longTermBetDialogShown) ? 'hidden' : ''}`}>
        <div className="LongTermBetDialogInner">
          <h2>Which camel will come in {localState.lastLongTermBettingOn} place at the very end?</h2>
          <div className="choices">
            {state.privateState.longTermRemaining.map(
              color => <img src={getCamel(color)} alt={color} className="camel-button" onClick={() => placeBet(color)} />
            )}
          </div>
          <div className="nevermind" onClick={() => localDispatch({ type: 'CLOSE_LONG_TERM_BET_DIALOG' })}>
            Never mind
          </div>
        </div>
      </div>
    </>
  );
}

export default LongTermBetDialog;
