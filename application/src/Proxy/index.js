import React, { useReducer, useEffect, useState } from 'react';
import Framework from '../D3-framework';
import { reducer } from './reducer';
import { createCRDT } from './create-crdt';

const Index = ({ id, crdt, params }) => {
  const [data, setData] = useState();
  // const defaultState = { crdt: createCRDT(crdt, params) };
  // const [state, dispatch] = useReducer(reducer, defaultState);

  console.log(id, crdt, params);
  // console.log(defaultState.crdt);

  /* https://www.w3schools.com/js/js_function_call.asp */

  const person = {
    fullName: function () {
      return this.firstName + ' ' + this.lastName;
    },
  };
  const person1 = {
    firstName: 'John',
    lastName: 'Doe',
  };
  const person2 = {
    firstName: 'Mary',
    lastName: 'Doe',
  };
  const f = (fname, objname) => person[fname].call(objname);
  console.log(f('fullName', person2));

  const g = (fname, objname) => person[fname].apply(objname);
  console.log(g('fullName', person1));

  /* https://www.w3schools.com/js/js_function_apply.asp */

  const query = () => {};

  const update = () => {};

  const merge = () => {};

  const apply = () => {};

  // useEffect function, renders visualization according to the CRDT data
  useEffect(() => {
    console.log('proxy useEffect');
  }, [data]);

  return <h2>{id}</h2>; // a Proxy itself does not render anything
};

export default Index;
