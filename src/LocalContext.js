import React from 'react';

// a second context! suck it, redux
const LocalContext = React.createContext();

const initialState = {
  placingMirageOasisFor: null,

  // these two are split so we can keep rendering it as the dialog fades out
  longTermBetDialogShown: false,
  lastLongTermBettingOn: null,
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

    'OPEN_LONG_TERM_BET_DIALOG': (state, action) => ({
      ...state,
      lastLongTermBettingOn: action.longTermBettingOn,
      longTermBetDialogShown: true,
    }),
    'CLOSE_LONG_TERM_BET_DIALOG': state => ({
      ...state,
      longTermBetDialogShown: false,
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