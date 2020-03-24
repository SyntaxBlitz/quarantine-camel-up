import React from 'react';

const CamelContext = React.createContext();

const initialState = {
  gameStarted: false,
};

const reducer = (state, action) => {
  const handler = {
    'SET_ENTIRE_STATE': (_, action) => action.newState,
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