/*  
    face example taken from d3 tutorial by freeCodeCamp.org
    source: https://www.youtube.com/watch?v=2LhoCfjm8R4&list=PLee96XBF3UtuOHagD-SxtXP3QI2ERrc34 
*/

const App = () => {
  return (
    <div className="app-content">
      <svg width="960" height="500">
        <circle
          cx="480"
          cy="250"
          r="245"
          fill="yellow"
          stroke="black"
          strokeWidth="10"
        />
      </svg>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
