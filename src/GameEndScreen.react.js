import React, { useContext, useEffect, useState } from 'react';
import { CamelContext } from './CamelContext';
import { LocalContext } from './LocalContext';

function GameEndScreen() {
  const { state } = useContext(CamelContext);
  const { localDispatch } = useContext(LocalContext);

  const [ stage, setStage ] = useState('before-lasts');
  const [ index, setIndex ] = useState(0);

  const renderWinning = winning => winning < 0 ? '-$' + -winning : '$' + winning;

  useEffect(() => {
    if (!state.endGameReveal) {
      return;
    }

    window.setTimeout(() => setStage('lasts'), 0);

    for (let i = 0; i < state.endGameReveal.longTermLasts.length; i++) {
      window.setTimeout(() => {
        setIndex(i + 1);
        localDispatch({ type: 'SET_INCLUDE_LASTS', index: i + 1, });
        // TODO rack up points here and in the other
      }, (i + 1) * 1500);
    }

    window.setTimeout(() => {
      setStage('after-lasts');
    }, state.endGameReveal.longTermLasts.length * 1500 + 3000);

    window.setTimeout(() => {
      setIndex(0);
      setStage('before-firsts');
      
      window.setTimeout(() => {
        setStage('firsts');
  
        for (let i = 0; i < state.endGameReveal.longTermFirsts.length; i++) {
          window.setTimeout(() => {
            setIndex(i + 1);
            localDispatch({ type: 'SET_INCLUDE_FIRSTS', index: i + 1, });
          }, (i + 1) * 1500);
        }
  
        window.setTimeout(() => {
          setStage('after-firsts');

          window.setTimeout(() => {
            setIndex(0);
            setStage('before-final');

            window.setTimeout(() => {
              setStage('final');

              for (let i = 0; i < state.endGameReveal.ranking.length; i++) {
                window.setTimeout(() => {
                  setIndex(i + 1);
                }, (i + 1) * 2000);
              }
              // just realized I really should've used sleep-promise
            }, 1000);
          }, 1000);
        }, state.endGameReveal.longTermLasts.length * 1500 + 4000);
      }, 0);
    }, state.endGameReveal.longTermLasts.length * 1500 + 4000);

    for (let i = 0; i < state.endGameReveal.ranking.length; i++) {
    }
  }, [ state.endGameReveal ]);

  if (!state.endGameReveal) {
    return null;
  }

  return (
    <div className="GameEndScreen">
      {/* {JSON.stringify(state.endGameReveal)} */}
      {stage.includes('lasts') ?
        <div className={`Lasts ${stage === 'lasts' ? '' : 'hidden'}`}>
          <h1>Last-place bets</h1>
          {state.endGameReveal.longTermLasts.map((bet, i) =>
            <div className={`reveal-row slow-reveal ${bet.me ? 'me' : ''} ${i < index ? '' : 'hidden'}`}>
              <div className="flavor">{bet.name} bet on the {bet.color} camel.</div>
              <div className="winning">{renderWinning(bet.winnings)}</div>
            </div>
          )}
        </div>: null
      }

      {stage.includes('firsts') ?
        <div className={`Firsts ${stage === 'firsts' ? '' : 'hidden'}`}>
          <h1>First-place bets</h1>
          {state.endGameReveal.longTermFirsts.map((bet, i) =>
            <div className={`reveal-row slow-reveal ${bet.me ? 'me' : ''} ${i < index ? '' : 'hidden'}`}>
              <div className="flavor">{bet.name} bet on the {bet.color} camel.</div>
              <div className="winning">{renderWinning(bet.winnings)}</div>
            </div>
          )}
        </div> : null
      }

      {stage.includes('final') ?
        <div className={`Final ${stage === 'final' ? '' : 'hidden'}`}>
          <h1>Final rankings</h1>
          {state.endGameReveal.ranking.map((ranking, i) =>
            <div className={`ranking-row slow-reveal ${ranking.me ? 'me' : ''} ${state.endGameReveal.ranking.length - i <= index ? '' : 'hidden'}`}>
              <div className="rank-name">{i + 1}. {ranking.name}</div>
              <div className="cash">{renderWinning(ranking.cash)}</div>
            </div>
          )}
        </div> : null
      }
    </div>
  );
}

export default GameEndScreen;
