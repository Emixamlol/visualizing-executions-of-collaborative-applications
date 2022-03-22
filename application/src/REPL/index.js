import React from 'react';
import CodeInput from './code-input';
import Interface from './interface';

// This component is responsible for allowing the user to add/remove/update CRDTs

const Index = () => {
  return (
    <div id="repl" className="flexbox-container">
      <CodeInput />
      <Interface />
    </div>
  );
};

export default Index;
