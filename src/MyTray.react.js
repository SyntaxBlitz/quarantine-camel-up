import React, { useContext } from 'react';
import { CamelContext } from './CamelContext';
import CamelPlacing from './CamelPlacing.react';

function MyTray() {
  const { state } = useContext(CamelContext);

  return (
    <div className="MyTray">
      <div className="message">
        {state.message}
      </div>
      <div className="cash">
        ${state.privateState.cash}
      </div>
      <CamelPlacing showBets={true} />
    </div>
  );
}

export default MyTray;
