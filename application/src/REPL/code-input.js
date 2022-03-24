import React, { useState, useEffect, useRef } from 'react';

const CodeInput = () => {
  const [code, setCode] = useState('');
  const codeRef = useRef(null);

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
      setCode(codeRef.current.value);
    }
  };

  const handleKeyUp = (e) => {
    const textarea = codeRef.current;
    textarea.style.height = 'auto';
    const scHeight = e.target.scrollHeight;
    textarea.style.height = `${scHeight}px`;
  };

  useEffect(() => {
    console.log('useEffect called');
    return () => {};
  }, []);

  return (
    <div className="repl-element">
      <h2>REPL</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          ref={codeRef}
          placeholder="add, remove or manipulate existing CRDTs"
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          autoFocus
        ></textarea>
      </form>
    </div>
  );
};

export default CodeInput;
