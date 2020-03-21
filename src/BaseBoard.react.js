import React from 'react';
import game_board from './game_board.jpg';

function BaseBoard() {
  return (
    <div className="BaseBoard">
      <img src={game_board} />
    </div>
  );
}

export default BaseBoard;
