import React, { useContext } from 'react';
import { CamelContext } from './CamelContext';

function MyTray() {
  const { state } = useContext(CamelContext);

  return (
    <div className="MyTray">
      {state.message}
    </div>
  );
}

export default MyTray;
