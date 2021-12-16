/*  
    face example taken from d3 tutorial by freeCodeCamp.org
    source: https://www.youtube.com/watch?v=2LhoCfjm8R4&list=PLee96XBF3UtuOHagD-SxtXP3QI2ERrc34 
*/

const width = 960;
const height = 500;
const centerX = width / 2;
const centerY = height / 2;
const strokeWidth = 10;
const eyeOffsetX = 90;
const eyeOffsetY = 100;
const eyeRadius = 50;
const mouthWidth = 20;
const mouthRadius = 140;

const mouthArc = d3
  .arc()
  .innerRadius(mouthRadius)
  .outerRadius(mouthRadius + mouthWidth)
  .startAngle(Math.PI / 2)
  .endAngle((Math.PI * 3) / 2);

const App = () => {
  return (
    <div className="app-content">
      <svg width={width} height={height}>
        <g transform={`translate(${centerX},${centerY})`}>
          <circle
            r={centerY - strokeWidth / 2}
            fill="yellow"
            stroke="black"
            strokeWidth={strokeWidth}
          />
          <circle cx={-eyeOffsetX} cy={-eyeOffsetY} r={eyeRadius} />
          <circle cx={eyeOffsetX} cy={-eyeOffsetY} r={eyeRadius} />
          <path d={mouthArc()} />
        </g>
      </svg>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
