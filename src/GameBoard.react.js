import React, { useEffect, useState } from 'react';
import BaseBoard from './BaseBoard.react';

const getStyles = rotateZ => ({
  transform: `perspective(1000px) translateZ(-500px) translateY(-550px) rotateX(25deg) rotateZ(${rotateZ}deg)`,
});

function GameBoard() {
  const [rotateZ, setRotateZ] = useState(0);

  useEffect(() => {
    window.onmousemove = e => {
      const percX = e.clientX / window.innerWidth;
      const percY = e.clientY / window.innerHeight;
      // easy to rotate at the bottom of the screen, hard at the top.
      // this is because most clickable stuff is on the top.
      setRotateZ((30 * percX - 15) * percY);
    };
  }, [setRotateZ]);

  return (
    <div className="GameBoard1">
      <div className="GameBoard" style={getStyles(rotateZ)}>
        <BaseBoard />
      </div>
    </div>
  );
}

export default GameBoard;
