import React from 'react';

const CamelContext = React.createContext();

const initialState = {
  accessToken: null,
  gameState: {
    players: [],
    dice: {
      blue: null,
      green: null,
      orange: null,
      yellow: null,
      white: null,
    },
    camels: {
      blue: null,
      green: null,
      orange: null,
      yellow: null,
      white: null,
    },
  },
  viewState: {
    pyramidHidden: false,
    savedDice: [],
    locked: false,
  },
};

const reducer = (state, action) => {
  const handler = {
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

    'VIEW_SET_LOCKED': (state, action) => ({
      ...state,
      viewState: {
        ...state.viewState,
        locked: action.locked,
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