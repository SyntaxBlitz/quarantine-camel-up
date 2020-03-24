import React, { useEffect, useReducer } from 'react';
import { CamelContext, initialState, reducer } from './CamelContext';
import './App.css';
import MyTray from './MyTray.react';
import GameBoard from './GameBoard.react';
import { setDispatch, connect, setName } from './comms';

function App() {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    setDispatch(dispatch);
    connect();

    // window.setTimeout(() => {dispatch({
    //   type: 'SET_CAMEL_POSITION',
    //   color: 'blue',
    //   pos: {
    //     spot: 2,
    //     height: 0,
    //   },
    // })}, 0);
    
    // window.setTimeout(() => dispatch({
    //   type: 'SET_CAMEL_POSITION',
    //   color: 'blue',
    //   pos: {
    //     spot: 3,
    //     height: 0,
    //   },
    // }), 6000);
    
    // window.setTimeout(() => dispatch({
    //   type: 'SET_CAMEL_POSITION',
    //   color: 'blue',
    //   pos: {
    //     spot: 4,
    //     height: 0,
    //   },
    // }), 7000);

    // window.setTimeout(() => dispatch({
    //   type: 'VIEW_SET_LOCKED',
    //   locked: true,
    // }), 2000);

    // window.setTimeout(() => dispatch({
    //   type: 'SET_DIE',
    //   color: 'blue',
    //   number: 2,
    // }), 2000);

    // window.setTimeout(() => dispatch({
    //   type: 'VIEW_SET_PYRAMID_HIDDEN',
    //   hidden: true,
    // }), 2000);

    // window.setTimeout(() => dispatch({
    //   type: 'VIEW_SAVE_DIE',
    //   color: 'blue',
    // }), 5000);

    // window.setTimeout(() => dispatch({
    //   type: 'VIEW_SET_PYRAMID_HIDDEN',
    //   hidden: false,
    // }), 6000);

    // window.setTimeout(() => dispatch({
    //   type: 'VIEW_SET_LOCKED',
    //   locked: false,
    // }), 9000);
  }, []);

  return (
    <CamelContext.Provider value={{ state, dispatch }}>
      {
        state.gameStarted
          ? <div className={`App ${state.privateState.myTurn ? 'MyTurn' : ''}`}>
              <MyTray />
              <GameBoard />
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
