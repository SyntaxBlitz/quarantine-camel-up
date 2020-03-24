import React, { useContext } from 'react';
import { CamelContext } from './CamelContext';
import CamelPlacing from './CamelPlacing.react';

const renderRows = legEndState => {
  if (legEndState === null) {
    return null;
  }

  return <>
    {legEndState.rollCash > 0 ? 'Rolls: $' + legEndState.rollCash + ' earned' : ''}
  </>
};

function LegEndModal() {
  const { state } = useContext(CamelContext);

  return (
    <div className={`LegEndModal ${(state.legEndState === null || state.legEndState.legModalLeaving) ? 'hidden' : ''}`}>
      <div className="LegEndModalInner">
        <h1>End of leg</h1>
        <CamelPlacing />
        {renderRows(state.legEndState)}
      </div>
    </div>
  );
}

export default LegEndModal;
