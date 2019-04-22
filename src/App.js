import React, { useState } from 'react';
import SlotMachine from './SlotMachine';

function App() {
  const [shouldRender, setRender] = useState(true); // eslint-disable-line no-unused-vars

  // this is to test how <SlotMachine /> clears various timers with componentWillUnmount()
  // setTimeout(() => setRender(false), 3000);

  return (
    <div className="wrapper">
      { shouldRender && <SlotMachine /> }
    </div>
  );
}

export default App;
