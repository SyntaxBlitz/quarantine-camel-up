import React from 'react';

const CamelContext = React.createContext();

const initialState = {
  accessToken: null,
  screen: 'ENTER_NAME',

  gameState: {
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
    availableBets: {
      blue: [ 2, 3, 5 ],
      green: [ 2, 3, 5 ],
      orange: [ 2, 3, 5 ],
      yellow: [ 2, 3, 5 ],
      white: [ 2, 3, 5 ],
    },
  },
  viewState: {
    pyramidHidden: false,
    savedDice: [],
  },
  privateState: {
    longTermRemaining: [ 'blue', 'green', 'orange', 'yellow', 'white' ],
    myTurn: true,
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