import * as React from 'react';
import Boids from './boids';

const App = ({ }) => {

  return (
    <div className="app">
      <div className="header">
        <h2>boidsim</h2>
      </div>
      <Boids />
    </div>
  );
};

export default App; 
