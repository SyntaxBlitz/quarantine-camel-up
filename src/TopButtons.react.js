import React, { useContext } from 'react';
import { LocalContext } from './LocalContext';
import { CamelContext } from './CamelContext';

function TopButtons() {
  const { state } = useContext(CamelContext);
  const { localDispatch } = useContext(LocalContext);

  const enabled =
    state.privateState.myTurn
    && state.privateState.longTermRemaining.length; // not used em all up

  const openLongTermBetDialog = enabled ? longTermBettingOn => {
    localDispatch({
      type: 'OPEN_LONG_TERM_BET_DIALOG',
      longTermBettingOn,
    });
  } : () => {};

  return (
    <div className={`TopButtons ${enabled ? 'enabled' : ''}`}>
      <div className="LongTermFirst" onClick={() => openLongTermBetDialog('first')}></div>
      <div className="LongTermFirstCount">{state.gameState.longTermFirstCount > 0 ? state.gameState.longTermFirstCount : ''}</div>
      <div className="LongTermLast" onClick={() => openLongTermBetDialog('last')}></div>
      <div className="LongTermLastCount">{state.gameState.longTermLastCount > 0 ? state.gameState.longTermLastCount : ''}</div>
    </div>
  );
}

export default TopButtons;
