import * as React from 'react';
import Boids from './boids';

const App = ({ }) => {

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div className="app">
      {isMobile ? (
        <div className="mobileError">
          <h1>Sorry, this doesn't work on mobile :(</h1>
          <p>(project runs on WebGL)</p>
          <a href="https://tom-b.dev"><button>Back to tom-b.dev</button></a>
        </div>
      ) : <Boids />}
    </div>
  );
};

export default App;   
