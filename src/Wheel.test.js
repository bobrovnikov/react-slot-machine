import React from 'react';
import ReactDOM from 'react-dom';
import Wheel from './Wheel';

describe('<Wheel />', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Wheel />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
