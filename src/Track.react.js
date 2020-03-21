import React from 'react';
import Spot from './Spot.react';
import Camels from './Camels.react';
import Pyramid from './Pyramid.react';

function Track() {
  return (
    <div className="Track">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(
        spot => <Spot key={spot} spot={spot} />
      )}
      <Camels />
      <Pyramid />
    </div>
  );
}

export default Track;
