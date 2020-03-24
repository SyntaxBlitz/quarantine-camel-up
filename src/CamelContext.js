import React from 'react';

const CamelContext = React.createContext();

const initialState = {
  gameStarted: false,
};

const reducer = (state, action) => {
  const handler = {
    'SET_ENTIRE_STATE': (_, action) => action.newState,
    
    'SET_CAMEL_POSITION': (state, action) => ({
      ...state,
      gameState: {
        ...state.gameState,
        camels: {
          ...state.gameState.camels,
          [action.color]: action.pos,
        },
      },
    }),
    'SET_DIE': (state, action) => ({
      ...state,
      gameState: {
        ...state.gameState,
        dice: {
          ...state.gameState.dice,
          [action.color]: action.number,
        },
      },
    }),
    'SET_MY_TURN': (state, action) => ({
      ...state,
      gameState: {
        ...state.gameState,
        myTurn: action.myTurn,
      },
    }),

    'VIEW_SET_PYRAMID_HIDDEN': (state, action) => ({
      ...state,
      viewState: {
        ...state.viewState,
        pyramidHidden: action.hidden,
      },
    }),
    'VIEW_SAVE_DIE': (state, action) => ({
      ...state,
      viewState: {
        ...state.viewState,
        savedDice: [...state.viewState.savedDice, action.color],
      },
    }),
    
  }[action.type];

  if (!handler) {
    return state;
  } else {
    return handler(state, action);
  }
};

export {
  CamelContext,
  initialState,
  reducer,
};