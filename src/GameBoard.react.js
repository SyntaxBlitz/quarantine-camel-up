import React, { useEffect, useState } from 'react';
import BaseBoard from './BaseBoard.react';
import Track from './Track.react';
import Dice from './Dice.react';
import BetCards from './BetCards.react';
import TopButtons from './TopButtons.react';

const getStyles = rotates => ({
  transform: `translateZ(-400px) translateY(-600px) rotateX(${rotates.x}deg) rotateZ(${rotates.z}deg)`,
});

function GameBoard() {
  const [rotates, setRotates] = useState({ x: 30, z: 0 });

  useEffect(() => {
    window.onmousemove = e => {
      const percX = e.clientX / window.innerWidth;
      const percY = e.clientY / window.innerHeight;

      setRotates({
        x: percY * 20 + 25,
        // easy to rotate at the bottom of the screen, hard at the top.
        // this is because most clickable stuff is on the top.
        z: (30 * percX - 15) * percY,
      });
    };
  }, [setRotates]);

  return (
    <div className="GameBoardContainer">
      <div className="GameBoard" style={getStyles(rotates)}>
        <BaseBoard />
        <TopButtons />
        <BetCards />
        <Dice />
        <Track />
      </div>
    </div>
  );
}

export default GameBoard;
