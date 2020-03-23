import React from 'react';
import Die from './Die.react'

function Dice() {
  return (
    <div className="Dice">
      <Die color="blue" />
      <Die color="yellow" />
      <Die color="orange" />
      <Die color="white" />
      <Die color="green" />
    </div>
  );
}

export default Dice;
