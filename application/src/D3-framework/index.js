import React from 'react';
import Timeline from './timeline';
import BasicState from './basic-state';
import ReplicaEllipse from './replicaEllipse';

const Index = ({ dimensions, svgRef }) => {
  // useEffect hook, the function defined within this hook is called each time the component is rendered again
  // useEffect(() => {
  //   const svg = d3.select(svgRef.current);

  //   return () => {};
  // }, [proxies]); // Render the component if state changes

  return (
    <>
      <Timeline dimensions={dimensions} svgRef={svgRef} />
      <BasicState dimensions={dimensions} svgRef={svgRef} />
      <ReplicaEllipse dimensions={dimensions} svgRef={svgRef} />
    </>
  );
};

export default Index;
