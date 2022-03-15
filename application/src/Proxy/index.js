import React, { useReducer } from 'react';
import Framework from '../D3-framework';
import { reducer } from './reducer';

const proxies = [];
const defaultState = {};

const Index = ({ crdt }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const query = () => {};

  const update = () => {};

  const merge = () => {};

  const apply = () => {};

  return (
    <>
      <Framework />
      <div>Index</div>
    </>
  );
};

export default Index;
