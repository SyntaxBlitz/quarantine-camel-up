import React, { useEffect, useReducer } from 'react';
import { CamelContext, initialState, reducer } from './CamelContext';
import './App.css';
import MyTray from './MyTray.react';
import GameBoard from './GameBoard.react';
import LegEndModal from './LegEndModal.react';
import { setDispatch, connect, setName } from './comms';

function App() {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    setDispatch(dispatch);
    connect();
  }, [ dispatch ]);

  return (
    <CamelContext.Provider value={{ state, dispatch }}>
      {
        state.gameStarted
          ? <div className={`App ${state.privateState.myTurn ? 'MyTurn' : ''}`}>
              <MyTray />
              <GameBoard />
              <LegEndModal />
            </div>
          : <div className="Registration">
            name? <input onChange={e => {
              setName(e.target.value);
            }} />
          </div>
      }
    </CamelContext.Provider>
  );
}

export default App;
