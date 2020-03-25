import React, { useContext } from 'react';
import { CamelContext } from './CamelContext';
import { LocalContext } from './LocalContext';
import mirage from './images/mirage.png';
import oasis from './images/oasis.png';

function MirageOasisDialog() {
  const { state } = useContext(CamelContext);
  const { localState, localDispatch } = useContext(LocalContext);

  return (
    <>
      <div className={`BackdropFilter ${(localState.placingMirageOasisFor === null) ? 'hidden' : ''}`} />
      <div className={`MirageOasisDialog ${(localState.placingMirageOasisFor === null) ? 'hidden' : ''}`}>
        <div className="MirageOasisDialogInner">
          <div className="choices">
            <img src={mirage} />
            <img src={oasis} />
          </div>
          <div className="nevermind" onClick={() => localDispatch({ type: 'CLOSE_MIRAGE_OASIS_DIALOG' })}>
            Never mind
          </div>
        </div>
      </div>
    </>
  );
}

export default MirageOasisDialog;
