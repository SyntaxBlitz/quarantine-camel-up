import React, { useContext, useEffect, useState } from 'react';
import { CamelContext } from './CamelContext';

function GameEndScreen() {
  const { state } = useContext(CamelContext);

  const [ index, setIndex ] = useState(0);

  useEffect(() => {
    if (!state.endGameReveal) {
      return;
    }

    for (let i = 0; i < 10; i++) {
      window.setTimeout(() => {
        setIndex(i + 1);
      }, (i + 1) * 1000);
    }
  }, [ state ]);

  if (!state.endGameReveal) {
    return null;
  }

  return (
    <div className="GameEndScreen">
      {JSON.stringify(state.endGameReveal)}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => <div style={{ opacity: i < index ? 1 : 0, transition: 'opacity 0.25s' }}>asdf</div>)}
    </div>
  );
}

export default GameEndScreen;
