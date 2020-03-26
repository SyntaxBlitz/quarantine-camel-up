import React, { useContext } from 'react';
import { CamelContext } from './CamelContext';
import CamelPlacing from './CamelPlacing.react';

const renderRows = legEndState => {
  if (legEndState === null) {
    return null;
  }

  return <>
    {legEndState.rollCash > 0
      ? <div>
          Rolls: ${legEndState.rollCash} earned
        </div>
      : null}
    {legEndState.mirageOasisCash > 0
      ? <div>
          {legEndState.mirageOasisType[0].toUpperCase()}{legEndState.mirageOasisType.substring(1)} earnings: ${legEndState.mirageOasisCash}
        </div>
      : null
    }
    {legEndState.shortTermBets.map(
      colorSummary =>
        colorSummary.winnings.length > 0
        ? <div>
            {colorSummary.color}:{' '}
            {colorSummary.winnings.map(winning => winning < 0 ? '-$' + -winning : '$' + winning).join(', ')}
          </div>
        : null
    )}
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
