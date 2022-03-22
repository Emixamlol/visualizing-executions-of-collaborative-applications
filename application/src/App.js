import React from 'react';
import Visualization from './Visualization';
import REPL from './REPL';

const App = () => {
  return (
    <div className="grid-container">
      <Visualization />
      <REPL />
    </div>
  );
};

export default App;
