import React, { useEffect } from 'react';

const data = [];

const Index = () => {
  // useEffect hook, the function defined within this hook is called each time the component is rendered again
  useEffect(() => {}, [data]); // Render the component if data changes

  return <div>{data}</div>;
};

export default Index;
