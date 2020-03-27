const sleep = require('sleep-promise');

const io = require('socket.io')(3511);

const state = {
  public: {
    // might be able to get away with having no gameStarted but I don't wanna think about the edge cases of join halfway through
    gameStarted: false,

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
      camelPlacing: [], // redundant state better than duplicating logic on the client
      availableBets: {
        blue: [],
        green: [],
        orange: [],
        yellow: [],
        white: [],
      },
      mirageOasisSpots: {},
      longTermFirstCount: 0,
      longTermLastCount: 0,
    },
    viewState: {
      pyramidHidden: false,
      savedDice: [],
      legModalLeaving: false,
    },
  },
  private: {
    idToSocket: {},
    idToName: {},
    turnOrder: [],
    playerTurn: 0,
    turnReady: false,
    longTermFirsts: [],
    longTermLasts: [],
    idToCash: {},
    rollers: [],
    legOver: false,
    placedBets: {
      blue: [],
      green: [],
      orange: [],
      yellow: [],
      white: [],
    },
    idToMirageOasis: {},
    showingEndGame: false,
  },
};

// https://stackoverflow.com/a/6274381/1826496
const shuffle = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const roll = () => Math.floor(Math.random() * 3) + 1;

const initializeGameState = () => {
  shuffle(Object.keys(state.public.gameState.camels)).forEach(camel => {
    const spot = roll();
    const height = Object.values(state.public.gameState.camels).map(c => c === null ? 0 : (c.spot === spot ? 1 : 0)).reduce((a, b) => a + b);
    
    state.public.gameState.camels[camel] = {
      spot,
      height,
    };
  });
  updateCamelPlacing();

  state.private.playerTurn = -1;  // increments before starting

  initializeLeg();
};

const updateAvailableBets = () => {
  state.public.gameState.availableBets = {
    blue: [ 2, 3, 5 ].filter((_, i) => i < 3 - state.private.placedBets.blue.length),
    green: [ 2, 3, 5 ].filter((_, i) => i < 3 - state.private.placedBets.green.length),
    orange: [ 2, 3, 5 ].filter((_, i) => i < 3 - state.private.placedBets.orange.length),
    yellow: [ 2, 3, 5 ].filter((_, i) => i < 3 - state.private.placedBets.yellow.length),
    white: [ 2, 3, 5 ].filter((_, i) => i < 3 - state.private.placedBets.white.length),
  };
};

const updateMirageOasisSpots = () => {
  state.public.gameState.mirageOasisSpots = Object.fromEntries(
    Object.values(state.private.idToMirageOasis).map(({ spot, type }) => [ spot, type ]),
  );
};

const initializeLeg = () => {
  state.private.placedBets = {
    blue: [],
    green: [],
    orange: [],
    yellow: [],
    white: [],
  };
  updateAvailableBets();

  state.public.gameState.dice = {
    blue: null,
    green: null,
    orange: null,
    yellow: null,
    white: null,
  };

  state.private.rollers = [];

  state.public.viewState.savedDice = [];

  state.private.idToMirageOasis = {};
  updateMirageOasisSpots();
};

const isPlayersTurn = id => state.private.turnOrder[state.private.playerTurn] === id && state.private.turnReady;

const privateStateForId = id => {
  return {
    myTurn: isPlayersTurn(id),
    longTermRemaining: [ 'blue', 'green', 'orange', 'yellow', 'white' ].filter(
      c => !state.private.longTermFirsts.some(bet => bet.id === id && bet.color === c)
        && !state.private.longTermLasts.some(bet => bet.id === id && bet.color === c),
    ),
    cash: state.private.idToCash[id],
    placedBets: Object.fromEntries(Object.keys(state.private.placedBets).map(color => [
      color,
      // I don't own a towel
      state.private.placedBets[color].map((id, i) => ({
        id,
        value: [ 5, 3, 2 ][i],
      })).filter(o => o.id === id).map(o => o.value),
    ])),
    mirageOasisAvailable: !state.private.idToMirageOasis[id],
  };
};

const registerSocket = socket => id => {
  state.private.idToSocket[id] = socket; 
};

const addPerson = id => name => {
  if (state.public.gameStarted) {
    return;
  }

  const oldName = state.private.idToName[id];
  state.private.idToName[id] = name;

  if (oldName === undefined) {
    state.private.turnOrder.push(id);

    state.private.idToCash[id] = 3;

    console.log('New player: ' + name + ', ' + id);
    console.log('Now we have ' + state.private.turnOrder.length + ' players');
  } else {
    console.log(`${oldName} changed their name to ${name}`);
  }
};

const startGame = () => {
  state.public.gameStarted = true;
  shuffle(state.private.turnOrder);
  initializeGameState();
  nextTurn();

  broadcastState();
};

const broadcastState = () => {
  Object.keys(state.private.idToSocket).forEach(id => {
    sendStateToSocket(id);
  });
};

const sendStateToSocket = id => {
  state.private.idToSocket[id].emit('UPDATE', {
    ...state.public,
    privateState: privateStateForId(id),
    legEndState: legEndStateForId(id),
    endGameReveal: gameEndStateForId(id),
  });
};

const advanceCamel = camel => {
  const stackedCamels = Object.keys(state.public.gameState.camels).filter(
    c => state.public.gameState.camels[c].spot === state.public.gameState.camels[camel].spot
      && state.public.gameState.camels[c].height >= state.public.gameState.camels[camel].height
  );

  const nextSquareCamelCount = Object.values(state.public.gameState.camels).filter(c => c.spot === state.public.gameState.camels[camel].spot + 1).length;

  const currentMovingCamelHeight = state.public.gameState.camels[camel].height;

  stackedCamels.forEach(c => {
    state.public.gameState.camels[c].spot++;
    state.public.gameState.camels[c].height = nextSquareCamelCount + (state.public.gameState.camels[c].height - currentMovingCamelHeight);
  });

  updateCamelPlacing();
};

const checkMirageOasis = async camel => {
  const spot = state.public.gameState.camels[camel].spot;

  const type = state.public.gameState.mirageOasisSpots[spot];

  if (type === 'mirage') {
    const stackHeight = Math.max(...Object.values(state.public.gameState.camels).filter(
      c => c.spot === spot
    ).map(c => c.height)) + 1;

    Object.values(state.public.gameState.camels).filter(
      c => c.spot === spot - 1
    ).forEach(c => c.height += stackHeight);

    Object.values(state.public.gameState.camels).filter(
      c => c.spot === spot
    ).forEach(c => c.spot--);
  } else if (type === 'oasis') {
    advanceCamel(camel);
  } else {
    return;
  }

  Object.values(state.private.idToMirageOasis).filter(mo => mo.spot === spot).forEach(mo => mo.earnings++);

  updateCamelPlacing();
  broadcastState();

  await sleep(1000);
};

const updateCamelPlacing = () => {
  state.public.gameState.camelPlacing = Object.keys(state.public.gameState.camels).sort((a, b) => {
    const [ camelA, camelB ] = [ state.public.gameState.camels[a], state.public.gameState.camels[b] ];
    if (camelA.spot === camelB.spot) {
      return camelB.height - camelA.height;
    }

    return camelB.spot - camelA.spot;
  });
};

const nextTurn = () => {
  state.private.playerTurn++;
  state.private.playerTurn %= state.private.turnOrder.length;
  state.public.message = `It's ${state.private.idToName[state.private.turnOrder[state.private.playerTurn]]}'s turn!`;
  state.private.turnReady = true;
  broadcastState();
};

const endLeg = async () => {
  state.private.legOver = true;
  state.public.viewState.legModalLeaving = false;
  broadcastState();

  await sleep(10000);

  state.private.turnOrder.forEach(id => {
    const legEndState = legEndStateForId(id);
    state.private.idToCash[id] += legEndState.totalWinnings;
  });

  state.public.viewState.legModalLeaving = true;
  broadcastState();

  await sleep(1000);

  if (gameOver()) {
    endGame();
    return;
  }

  state.private.legOver = false;
  state.public.viewState.savedDice = [];  // fly the dice back into the pyramid before resetting the leg
  broadcastState();

  await sleep(1000);

  initializeLeg();
  broadcastState();
  await sleep(1000);
};

const legEndStateForId = id => {
  if (!state.private.legOver) {
    return null;
  }

  const legEndState = {
    rollCash: state.private.rollers.filter(roller => roller === id).length,
    // you're allowed to hate me for the following code
    shortTermBets: Object.keys(state.private.placedBets).map(color => ({
      color,
      winnings: state.private.placedBets[color].map((id, i) => ({
        id,
        value: state.public.gameState.camelPlacing[0] === color
          ? [ 5, 3, 2 ][i]
          : state.public.gameState.camelPlacing[1] === color
            ? 1
            : -1,
      })).filter(o => o.id === id).map(o => o.value),
    })),
    mirageOasisCash: state.private.idToMirageOasis[id] ? state.private.idToMirageOasis[id].earnings : 0,
    mirageOasisType: state.private.idToMirageOasis[id] ? state.private.idToMirageOasis[id].type : null,
    legModalLeaving: state.public.viewState.legModalLeaving,
  };
  
  legEndState.totalWinnings =
    legEndState.rollCash
    + legEndState.shortTermBets.map(
        colorSummary =>
          colorSummary.winnings.reduce((a, b) => a + b, 0)
      ).reduce((a, b) => a + b)
    + legEndState.mirageOasisCash;

  return legEndState;
};

const gameEndStateForId = id => {
  if (!state.private.showingEndGame) {
    return null;
  }

  // oh you are gonna LOVE this
  const longTermReward = [ 8, 5, 3, 2 ];
  let nextLongTermWinRewardIndex = 0;
  let nextLongTermLossRewardIndex = 0;

  const gameEndState = {
    longTermFirsts: state.private.longTermFirsts.map(
      ({ id: betId, color }) => ({
        winnings: color === state.public.gameState.camelPlacing[0] ? longTermReward[nextLongTermWinRewardIndex] ? longTermReward[nextLongTermWinRewardIndex++] : 1 : -1,
        color,
        name: state.private.idToName[betId],
        me: id === betId,
        
        betId, // we gotta REMOVE this for  s e c u r i t y  but need it for the below score calculation
      }),
    ),
    longTermLasts: state.private.longTermLasts.map(
      ({ id: betId, color }) => ({
        winnings: color === state.public.gameState.camelPlacing[4] ? longTermReward[nextLongTermLossRewardIndex] ? longTermReward[nextLongTermLossRewardIndex++] : 1 : -1,
        color,
        name: state.private.idToName[betId],
        me: id === betId,
        
        betId,
      }),
    ),
  };

  gameEndState.ranking = state.private.turnOrder.map(
    playerId => ({
      cash: state.private.idToCash[playerId]
        + gameEndState.longTermFirsts.filter(b => b.betId === playerId).map(b => b.winnings).reduce((a, b) => a + b, 0)
        + gameEndState.longTermLasts.filter(b => b.betId === playerId).map(b => b.winnings).reduce((a, b) => a + b, 0),
      name: state.private.idToName[playerId],
      me: playerId === id,
    }),
  ).sort(
    (a, b) => b.cash - a.cash,
  );

  gameEndState.longTermFirsts.forEach(o => delete o.betId);
  gameEndState.longTermLasts.forEach(o => delete o.betId);

  return gameEndState;
};

const gameOver = () => Object.values(state.public.gameState.camels).some(c => c.spot > 16);

const endGame = () => {
  state.private.showingEndGame = true;
  state.public.message = 'The game is over!';
  broadcastState();
};

io.on('connection', socket => {
  socket.on('REGISTER_SOCKET', ({ id }) => {
    registerSocket(socket)(id);
    sendStateToSocket(id);
  });

  socket.on('SET_NAME', ({ name, id }) => {
    addPerson(id)(name);
  });

  socket.on('START_GAME', () => {
    startGame();
  });

  socket.on('ROLL', async ({ id }) => {
    if (!isPlayersTurn(id)) {
      return;
    }

    state.private.rollers.push(id);

    const eligibleDice = Object.keys(state.public.gameState.dice).filter(d => state.public.gameState.dice[d] === null);
    const rolledDie = shuffle(eligibleDice)[0];
    const dieValue = roll();

    state.private.turnReady = false;
    state.public.message = `${state.private.idToName[id]} has chosen to roll a die!`;
    broadcastState();

    await sleep(1000);

    state.public.gameState.dice[rolledDie] = dieValue;
    state.public.viewState.pyramidHidden = true;  // takes 3 seconds
    broadcastState();

    await sleep(1000);

    state.public.message = `The ${rolledDie} camel advances ${dieValue} space${dieValue > 1 ? 's' : ''}!`;
    broadcastState();

    await sleep(2000); // wait for the pyramid to finish

    state.public.message = '';
    state.public.viewState.pyramidHidden = false;
    state.public.viewState.savedDice.push(rolledDie);
    broadcastState();

    for (let i = 0; i < dieValue; i++) {
      advanceCamel(rolledDie);
      broadcastState();
      await sleep(1000);
      if (gameOver()) {
        await sleep(2000); // let it sink in
        break;
      }
    }

    await checkMirageOasis(rolledDie);

    if (Object.values(state.public.gameState.dice).filter(d => d === null).length === 0
      || gameOver()
    ) {
      await endLeg(); // also ends the game if necessary
    }

    if (!gameOver()) {
      nextTurn();
    }
  });

  socket.on('SHORT_TERM_BET', async ({ id, color }) => {
    if (!isPlayersTurn(id)) {
      return;
    }

    if (state.public.gameState.availableBets[color].length === 0) {
      // don't think this is possible without a hacked client bc of the previous gate
      // unless, ig, it's the _next_ player's turn and the delay from the turn being taken wasn't enough for a sync
      // hmm or if the next player is spam-clicking... anyway we have this gate here even though a hacked client can still cheat/crash the server
      return;
    }

    state.private.turnReady = false;
    state.private.placedBets[color].push(id);
    updateAvailableBets();

    state.public.message = `${state.private.idToName[id]} has placed a short-term bet on the ${color} camel!`;

    broadcastState();

    await sleep(2000);

    nextTurn();
  });

  socket.on('PLACE_MIRAGE_OASIS', async ({ id, spot, type }) => {
    if (!isPlayersTurn(id)) {
      return;
    }

    // duplicating this logic on the server to double-check
    if (!!state.private.idToMirageOasis[id]) {
      return;
    }

    if (spot === 1) {
      return;
    }

    if (!!state.public.gameState.mirageOasisSpots[spot]) {
      return;
    }

    // no need to explicitly check the edges
    if (!!state.public.gameState.mirageOasisSpots[spot + 1] || state.public.gameState.mirageOasisSpots[spot - 1]) {
      return;
    }

    if (Object.values(state.public.gameState.camels).some(c => c.spot === spot)) {
      return;
    }

    state.private.turnReady = false;
    state.private.idToMirageOasis[id] = { spot, type, earnings: 0 };
    updateMirageOasisSpots();

    state.public.message = `${state.private.idToName[id]} has placed a${{ mirage: '', oasis: 'n' }[type]} ${type} on the board!`;

    broadcastState();

    await sleep(2000);

    nextTurn();
  });

  socket.on('PLACE_LONG_TERM_BET', async ({ id, type, color }) => {
    if (!isPlayersTurn(id)) {
      return;
    }

    const arr = {
      first: state.private.longTermFirsts,
      last: state.private.longTermLasts,
    }[type];

    if (arr.some(bet => bet.id === id && bet.color === color)) {
      return;
    }

    state.private.turnReady = false;
    arr.push({
      id,
      color,
    });

    state.public.gameState.longTermFirstCount = state.private.longTermFirsts.length;
    state.public.gameState.longTermLastCount = state.private.longTermLasts.length;

    state.public.message = `${state.private.idToName[id]} has placed a long-term bet for ${type} place!`;

    await sleep(250); // hack to make sure the dialog fades out before the camel gets removed from the dialog

    broadcastState();

    await sleep(2000);

    nextTurn();
  });
});