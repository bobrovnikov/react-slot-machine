import React from 'react';

const symbol2emoji = {
  S: '🍓',
  B: '🍌',
  O: '🍊',
  M: '🐵'
};

const Wheel = ({ symbol }) => 
  <div className="machine__wheel">
    {symbol2emoji[symbol]}
  </div>

export default Wheel;
