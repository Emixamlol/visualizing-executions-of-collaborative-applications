import React, { useState, useEffect, useRef, useContext } from 'react';
import { ProxyContext } from '../Proxy/proxy-context';
import { IdGenerator } from './id-generator';

const CodeInput = () => {
  const [code, setCode] = useState(''); // the code that gets written in the textarea
  const codeRef = useRef(null); // reference to the textarea

  const { removeProxy, addProxy } = useContext(ProxyContext); // get the functions in order to add/delete proxies from the ProxyContext

  // Handle what has to happen when the user submits the code
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    console.log('submitting code');
    // try to parse the code, if valid create a Proxy
    try {
      const parsed = JSON.parse(`{"code": "${codeRef.current.value},"}`);
      console.log(parsed);
      addProxy({ id: IdGenerator.next().value, crdt: 'crdt' });
    } catch (e) {
      console.log(e);
    } finally {
      setCode('');
      codeRef.current.value = '';
    }
  };

  // Handle what has to happen when a or multiple keys are pressed
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) handleSubmit(e);
  };

  // Handle what has to happen when a key is released
  const handleKeyUp = (e) => {
    setCode(codeRef.current.value);
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
        <button type="submit" disabled={!code}>
          execute
        </button>
      </form>
    </div>
  );
};

export default CodeInput;
