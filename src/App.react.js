import React, { useEffect, useReducer } from 'react';
import { CamelContext, initialState, reducer } from './CamelContext';
import './App.css';
import MyTray from './MyTray.react';
import GameBoard from './GameBoard.react';

function App() {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    window.setTimeout(() => {dispatch({
      type: 'SET_CAMEL_POSITION',
      color: 'blue',
      pos: {
        spot: 2,
        height: 0,
      },
    })}, 0);
    
    window.setTimeout(() => dispatch({
      type: 'SET_CAMEL_POSITION',
      color: 'blue',
      pos: {
        spot: 3,
        height: 0,
      },
    }), 6000);
    
    window.setTimeout(() => dispatch({
      type: 'SET_CAMEL_POSITION',
      color: 'blue',
      pos: {
        spot: 4,
        height: 0,
      },
    }), 7000);

    window.setTimeout(() => dispatch({
      type: 'VIEW_SET_LOCKED',
      locked: true,
    }), 2000);

    window.setTimeout(() => dispatch({
      type: 'SET_DIE',
      color: 'blue',
      number: 2,
    }), 2000);

    window.setTimeout(() => dispatch({
      type: 'VIEW_SET_PYRAMID_HIDDEN',
      hidden: true,
    }), 2000);

    window.setTimeout(() => dispatch({
      type: 'VIEW_SAVE_DIE',
      color: 'blue',
    }), 5000);

    window.setTimeout(() => dispatch({
      type: 'VIEW_SET_PYRAMID_HIDDEN',
      hidden: false,
    }), 6000);

    window.setTimeout(() => dispatch({
      type: 'VIEW_SET_LOCKED',
      locked: false,
    }), 9000);
  }, []);

  return (
    <CamelContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <MyTray />
        <GameBoard />
      </div>
    </CamelContext.Provider>
  );
}

export default App;
