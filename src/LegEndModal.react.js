import React, { useContext } from 'react';
import { CamelContext } from './CamelContext';
import CamelPlacing from './CamelPlacing.react';

const renderRows = legEndState => {
  if (legEndState === null) {
    return null;
  }

  return <>
    {legEndState.rollCash > 0
      ? <div className="leg-end-row">
          <div className="flavor">Rolls</div>
          <div className="earnings">${legEndState.rollCash}</div>
        </div>
      : null}
    {legEndState.mirageOasisCash > 0
      ? <div className="leg-end-row">
          <div className="flavor">{legEndState.mirageOasisType[0].toUpperCase()}{legEndState.mirageOasisType.substring(1)} tile</div>
          <div className="earnings">${legEndState.mirageOasisCash}</div>
        </div>
      : null
    }
    {legEndState.shortTermBets.map(
      colorSummary =>
        colorSummary.winnings.length > 0
        ? colorSummary.winnings.map((winning, i) => 
            <div className="leg-end-row">
              <div className="flavor">{i == 0 ? <>Bet on {colorSummary.color}</> : null}</div>
              <div className="earnings">{winning < 0 ? '-$' + -winning : '$' + winning}</div>
            </div>
          )
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
