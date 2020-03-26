import React from 'react';

// a second context! suck it, redux
const LocalContext = React.createContext();

const initialState = {
  placingMirageOasisFor: null,
};

const reducer = (state, action) => {
  console.log(state, action);
  const handler = {
    'OPEN_MIRAGE_OASIS_DIALOG': (state, action) => ({
      ...state,
      placingMirageOasisFor: action.spot,
    }),

    'CLOSE_MIRAGE_OASIS_DIALOG': state => ({
      ...state,
      placingMirageOasisFor: null,
    }),
  }[action.type];

  if (!handler) {
    return state;
  } else {
    return handler(state, action);
  }
};

export {
  LocalContext,
  initialState,
  reducer,
};