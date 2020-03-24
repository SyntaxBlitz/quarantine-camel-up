import React, { useContext } from 'react';
import { CamelContext } from './CamelContext';
import CamelPlacing from './CamelPlacing.react';

function LegEndModal() {
  const { state } = useContext(CamelContext);

  return (
    <div className="LegEndModal">
      <div className="LegEndModalInner">
        <h1>End of leg</h1>
        <CamelPlacing />
      </div>
    </div>
  );
}

export default LegEndModal;
