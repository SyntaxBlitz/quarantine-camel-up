import React, { useContext } from 'react';
import { LocalContext } from './LocalContext';
import mirage from './images/mirage.png';
import oasis from './images/oasis.png';
import { placeMirageOasis } from './comms';

function MirageOasisDialog() {
  const { localState, localDispatch } = useContext(LocalContext);

  const place = type => {
    placeMirageOasis(type)(localState.placingMirageOasisFor);
    localDispatch({ type: 'CLOSE_MIRAGE_OASIS_DIALOG' });
  };

  return (
    <>
      <div className={`BackdropFilter ${(localState.placingMirageOasisFor === null) ? 'hidden' : ''}`} />
      <div className={`MirageOasisDialog ${(localState.placingMirageOasisFor === null) ? 'hidden' : ''}`}>
        <div className="MirageOasisDialogInner">
          <div className="choices">
            <img src={mirage} onClick={() => place('mirage')} />
            <img src={oasis} onClick={() => place('oasis')} />
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
