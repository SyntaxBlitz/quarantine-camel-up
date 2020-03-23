import React from 'react';
import BetCardStack from './BetCardStack.react'

function BetCards() {
  return (
    <div className="BetCards">
      <BetCardStack color="blue" />
      <BetCardStack color="yellow" />
      <BetCardStack color="orange" />
      <BetCardStack color="white" />
      <BetCardStack color="green" />
    </div>
  );
}

export default BetCards;
