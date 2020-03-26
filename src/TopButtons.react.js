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
      <div className="LongTermLast" onClick={() => openLongTermBetDialog('last')}></div>
    </div>
  );
}

export default TopButtons;
