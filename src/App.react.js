import React, { useEffect, useReducer } from 'react';
import { CamelContext, initialState, reducer } from './CamelContext';
import { LocalContext, initialState as initialLocalState, reducer as localReducer } from './LocalContext';
import './App.css';
import MyTray from './MyTray.react';
import GameBoard from './GameBoard.react';
import LegEndModal from './LegEndModal.react';
import MirageOasisDialog from './MirageOasisDialog.react';
import { setDispatch, connect, setName } from './comms';

function App() {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    setDispatch(dispatch);
    connect();
  }, [ dispatch ]);

  const [ localState, localDispatch ] = useReducer(localReducer, initialLocalState);

  // todo:
  // mirages / oases
  // long-term bets/endgame
  // tooltip
  // fix for observers
  // images
  // not sure this is really worth, but: prevent placing mirage/oasis before the last-place camel?

  return (
    <CamelContext.Provider value={{ state, dispatch }}>
      <LocalContext.Provider value={{ localState, localDispatch }}>
        {
          state.gameStarted
            ? <div className={`App ${state.privateState.myTurn ? 'MyTurn' : ''}`}>
                <MyTray />
                <GameBoard />
                <LegEndModal />
                <MirageOasisDialog />
              </div>
            : <div className="Registration">
              name? <input onChange={e => {
                setName(e.target.value);
              }} />
            </div>
        }
      </LocalContext.Provider>
    </CamelContext.Provider>
  );
}

export default App;
