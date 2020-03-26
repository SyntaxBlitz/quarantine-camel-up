import React, { useContext } from 'react';
import { CamelContext } from './CamelContext';
import CamelPlacing from './CamelPlacing.react';
import { LocalContext } from './LocalContext';

function MyTray() {
  const { state } = useContext(CamelContext);
  const { localState } = useContext(LocalContext);

  return (
    <div className="MyTray">
      <div className="message">
        {state.message}
      </div>
      <div className="cash">
        ${state.privateState.cash
          + (localState.includeLasts > 0
            ? state.endGameReveal.longTermLasts.slice(0, localState.includeLasts).filter(b => b.me).map(b => b.winnings).reduce((a, b) => a + b, 0)
            : 0)
          + (localState.includeFirsts > 0
            ? state.endGameReveal.longTermFirsts.slice(0, localState.includeFirsts).filter(b => b.me).map(b => b.winnings).reduce((a, b) => a + b, 0)
            : 0)}
      </div>
      <CamelPlacing showBets={true} />
    </div>
  );
}

export default MyTray;
