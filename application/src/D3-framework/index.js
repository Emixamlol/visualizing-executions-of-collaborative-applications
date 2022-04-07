import React, { useEffect } from 'react';

const Index = ({ proxy }) => {
  console.log(proxy);

  const state = proxy.getState();
  console.log(`state = ${state}`);

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

  // useEffect hook, the function defined within this hook is called each time the component is rendered again
  useEffect(() => {}, [state]); // Render the component if state changes

  return <div>{state}</div>;
};

export default Index;
