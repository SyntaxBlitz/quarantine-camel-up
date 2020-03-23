import React, { useState, useContext } from 'react';
import pyramidSide from './images/pyramid-side.png';
import { CamelContext } from './CamelContext';

function Pyramid() {
  const [ hovered, setHovered ] = useState(false);
  const { state } = useContext(CamelContext);

  return (
    <div className={'Pyramid' + (hovered && !state.viewState.locked ? ' hovered' : '') + (state.viewState.pyramidHidden ? ' hidden' : '')} onClick={() => alert(1)}>
      {/* we need to put something under the pyramid to capture pointer events,
      since we can't capture pointer events on the pyramid itself (because
      otherwise the transparent stuff captures pointer events and we can't
      click behind the pyramid) */}
      <div className="hidden-base" onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)} />
      {/* <img src={pyramidSide} className="back" /> */}
      <img src={pyramidSide} className="front" />
      <img src={pyramidSide} className="left" />
      <img src={pyramidSide} className="right" />
    </div>
  );
}

export default Pyramid;
