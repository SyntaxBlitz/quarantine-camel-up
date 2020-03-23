import sleep from 'sleep-promise';

const io = require('socket.io')(80);

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
      availableBets: {
        blue: [],
        green: [],
        orange: [],
        yellow: [],
        white: [],
      },
    },
    viewState: {
      pyramidHidden: false,
      savedDice: [],
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

const roll = () => {
  return Math.floor(Math.random() * 3) + 1;
};

const initializeGameState = () => {
  shuffle(Object.keys(state.public.camels)).forEach(camel => {
    const spot = roll();
    const height = Object.values(state.public.camels).map(c => c === null ? 0 : (c.spot === spot ? 1 : 0)).reduce((a, b) => a + b);
    
    state.public.camels[camel] = {
      spot,
      height,
    };
  });

  state.private.playerTurn = -1;  // increments before starting
  
  initializeLeg();
};

const initializeLeg = () => {
  state.public.gameState.availableBets = {
    blue: [ 2, 3, 5 ],
    green: [ 2, 3, 5 ],
    orange: [ 2, 3, 5 ],
    yellow: [ 2, 3, 5 ],
    white: [ 2, 3, 5 ],
  };

  state.public.gameState.dice = {
    blue: null,
    green: null,
    orange: null,
    yellow: null,
    white: null,
  };

  state.public.viewState.savedDice = [];
};

const isPlayersTurn = id => turnOrder[state.private.playerTurn] === id && state.private.turnReady;

const privateStateForId = id => {
  return {
    myTurn: isPlayersTurn(id),
    longTermRemaining: [ 'blue', 'green', 'orange', 'yellow', 'white' ].filter(
      c => !private.longTermFirsts.some(bet => bet.id === id && bet.color === c)
        && !private.longTermLasts.some(bet => bet.id === id && bet.color === c),
    ),
    cash: idToCash[id],
  };
};

const registerSocket = socket => id => {
  state.private.idToSocket[id] = socket; 
};

const addPerson = id => name => {
  if (state.public.gameStarted) {
    return;
  }

  state.private.idToName[id] = name;
  state.private.turnOrder.push(id);

  // shuffle turn order?

  state.private.idToCash[id] = 3;

  console.log('New player: ' + name + ', ' + id);
  console.log('Now we have ' + Object.keys(state.private.idToSocket).length + ' players');
};

const startGame = () => {
  state.public.gameStarted = true;
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
  state.private.idToSocket[id].emit('update', {
    ...state.public,
    privateState: privateStateForId(id);
  });
};

const advanceCamel = camel => {
  const stackedCamels = Object.keys(state.public.camels).filter(
    c => state.public.camels[c].spot === state.public.camels[camel].spot
      && state.public.camels[c].height >= state.public.camels[camel].height
  );

  const nextSquareCamelCount = Object.values(state.public.camels).filter(c => c.spot === state.public.camels[camel].spot + 1).length;

  stackedCamels.forEach(c => {
    state.public.camels[c].spot++;
    state.public.camels[c].height += nextSquareCamelCount;
  });
};

const nextTurn = () => {
  state.private.playerTurn++;
  state.private.playerTurn %= state.private.turnOrder.length;
  state.public.message = `It's ${state.private.idToName[state.private.turnOrder[state.private.playerTurn]]}'s turn!`;
  state.private.turnReady = true;
};

io.on('connection', socket => {
  socket.on('REGISTER_SOCKET', ({ id }) => {
    registerSocket();
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

    const eligibleDice = Object.keys(state.gameState.dice).filter(d => state.gameState.dice[d] === null);
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
    state.public.gameState.savedDice.push(rolledDie);
    broadcastState();

    for (let i = 0; i < dieValue; i++) {
      advanceCamel(rolledDie);
      // TODO spot 17
      await sleep(1000);
    }

    // TODO oasis / mirage

    // TODO what if leg is over?

    nextTurn();
  });
});