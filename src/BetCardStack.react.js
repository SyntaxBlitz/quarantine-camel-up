import React, { useContext } from 'react';

import { CamelContext } from './CamelContext';
import { placeShortTermBet } from './comms';

import blueBet2 from './images/bet-blue-2.png';
import blueBet3 from './images/bet-blue-3.png';
import blueBet5 from './images/bet-blue-5.png';
import greenBet2 from './images/bet-green-2.png';
import greenBet3 from './images/bet-green-3.png';
import greenBet5 from './images/bet-green-5.png';
import orangeBet2 from './images/bet-orange-2.png';
import orangeBet3 from './images/bet-orange-3.png';
import orangeBet5 from './images/bet-orange-5.png';
import yellowBet2 from './images/bet-yellow-2.png';
import yellowBet3 from './images/bet-yellow-3.png';
import yellowBet5 from './images/bet-yellow-5.png';
import whiteBet2 from './images/bet-white-2.png';
import whiteBet3 from './images/bet-white-3.png';
import whiteBet5 from './images/bet-white-5.png';

const getCard = color => coins => {
  return {
    blue: {
      2: blueBet2,
      3: blueBet3,
      5: blueBet5,
    }[coins],
    green: {
      2: greenBet2,
      3: greenBet3,
      5: greenBet5,
    }[coins],
    orange: {
      2: orangeBet2,
      3: orangeBet3,
      5: orangeBet5,
    }[coins],
    yellow: {
      2: yellowBet2,
      3: yellowBet3,
      5: yellowBet5,
    }[coins],
    white: {
      2: whiteBet2,
      3: whiteBet3,
      5: whiteBet5,
    }[coins],
  }[color];
};

function BetCardStack(props) {
  const { state } = useContext(CamelContext);

  return (
    <div className={`BetCardStack ${props.color}`} onClick={() => placeShortTermBet(props.color)}>
      <img src={getCard(props.color)(2)} className={`bet-value-2 ${state.gameState.availableBets[props.color].includes(2) ? '' : 'hidden'}`} />
      <img src={getCard(props.color)(3)} className={`bet-value-3 ${state.gameState.availableBets[props.color].includes(3) ? '' : 'hidden'}`} />
      <img src={getCard(props.color)(5)} className={`bet-value-5 ${state.gameState.availableBets[props.color].includes(5) ? '' : 'hidden'}`} />
    </div>
  );
}

export default BetCardStack;
