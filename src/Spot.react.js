import React from 'react';

function Spot(props) {
  return (
    <div className={'Spot ' + `spot-${props.spot}`}>
      {/* {props.spot} */}
    </div>
  );
}

export default Spot;
