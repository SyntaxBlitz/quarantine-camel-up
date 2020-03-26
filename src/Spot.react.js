import React, { useContext } from 'react';
import { CamelContext } from './CamelContext';
import { LocalContext } from './LocalContext';
import mirage from './images/mirage.png';
import oasis from './images/oasis.png';

function Spot(props) {
  const { state } = useContext(CamelContext);
  const { localState, localDispatch } = useContext(LocalContext);

  // most logic I like to keep exclusively on the server but this will be duplicated
  // since it also includes some client-only stuff

  // my turn
  // dialog not up
  // not spot 1
  // not already placed
  // none on this spot
  // none on adjacent spots
  // no camels on this spot
  const enabled =
    state.privateState.myTurn
    && localState.placingMirageOasisFor === null
    && props.spot !== 1
    && state.privateState.mirageOasisAvailable
    && !state.gameState.mirageOasisSpots[props.spot - 1]
    && !state.gameState.mirageOasisSpots[props.spot]
    && !state.gameState.mirageOasisSpots[props.spot + 1]
    && !Object.values(state.gameState.camels).some(c => c.spot === props.spot);

  const openMirageOasisDialog = enabled ? () => {
    localDispatch({
      type: 'OPEN_MIRAGE_OASIS_DIALOG',
      spot: props.spot,
    });
  } : () => {};

  return (
    <div className={`Spot spot-${props.spot} ${enabled ? 'enabled' : ''}`} onClick={openMirageOasisDialog}>
      <img src={mirage} className={state.gameState.mirageOasisSpots[props.spot] !== 'mirage' && 'hidden'} />
      <img src={oasis} className={state.gameState.mirageOasisSpots[props.spot] !== 'oasis' && 'hidden'} />
    </div>
  );
}

export default Spot;
