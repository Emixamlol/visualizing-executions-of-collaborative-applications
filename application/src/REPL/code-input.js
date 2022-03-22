import React, { useState, useEffect, useRef } from 'react';

const CodeInput = () => {
  const [code, setCode] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    console.log('submitting code');
    setCode('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    } else {
      setCode(inputRef.current.value);
    }
  };

  useEffect(() => {
    console.log('useEffect called');
  }, [code]);

  return (
    <div className="repl-element">
      <h2>REPL</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" ref={inputRef} onKeyDown={handleKeyDown} />
      </form>
    </div>
  );
};

export default CodeInput;
