import React, { Component } from 'react';
import Stage from './Stage';
import Wheel from './Wheel';

class SlotMachine extends Component {
  constructor(props) {
    super(props);
    this.possibleSymbols = ['S', 'B', 'O', 'M'];
    this.numOfWheels = 3;
    this.wheelGenerators = [];
    this.state = {
      stage: Stage.READY,
      wheels: this.getRandomWheels(),
      text: 'Spin to win!'
    };
    this.timers = {};
  }

  componentDidMount() {
    // 4. If the user doesn’t press start, then the machine does it automatically after 5 seconds
    this.timers.autoStart = setTimeout(() => this.start(true), 5000);
  }

  componentWillUnmount() {
    // setInterval() and setTimeout() share the same pool of IDs
    // so clearInterval() and clearTimeout() can technically be used interchangeably
    Object.values(this.timers).forEach(timerId => clearInterval(timerId));
  }

  say(text) {
    this.setState({ text });
  }

  * wheelGenerator(symbols) {
    let index = this.pickRandomIndex(symbols);
    while (true) {
      yield symbols[index];
      index = index === symbols.length - 1 ? 0 : index + 1;
    }
  }

  getRandomWheels() {
    return Array(this.numOfWheels).fill().map((wheel, idx) => {
      this.wheelGenerators.push(this.wheelGenerator(this.possibleSymbols));
      return this.wheelGenerators[idx].next().value;
    });
  }

  pickRandomIndex(collection) {
    return Math.floor(Math.random() * collection.length);
  }

  pickRandomItem(collection) {
    const randomIndex = this.pickRandomIndex(collection);
    return collection[randomIndex];
  }

  // The same symbol in all the wheels, the prize is 100 dollars
  // Two consecutive symbols, then the prize is 20 dollars
  // Two identical non-consecutive symbols, the prize is 10 dollars
  calculatePrize(symbols) {
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
      return 100;
    }

    if (symbols[0] === symbols[1] || symbols[1] === symbols[2]) {
      return 20;
    } 
    
    if (symbols[0] === symbols[2]) {
      return 10;
    }

    return 0;
  }
  

  start(isAuto = false) {
    clearTimeout(this.timers.autoStart);
    this.timers.spinner = setInterval(() => {
      const newWheels = this.state.wheels.map((wheel, idx) => this.wheelGenerators[idx].next().value);
      this.setState({
        wheels: newWheels
      });
    }, 50);
    this.setState({
      stage: Stage.SPINNING
    });
    this.say(isAuto ? 'Started automatically!' : 'Spinning...');
    // 5. If the user doesn’t press stop, the machine stops automatically after 10 seconds (after starting)
    this.timers.autoStop = setTimeout(() => this.stop(TextTrackCue), 10000);
  }

  stop(isAuto = false) {
    clearInterval(this.timers.spinner);
    clearTimeout(this.timers.autoStop);
    const finalWheels = Array(this.numOfWheels).fill().map(() => this.pickRandomItem(this.possibleSymbols));
    const prize = this.calculatePrize(finalWheels);
    this.setState({
      wheels: finalWheels,
      stage: Stage.READY
    });
    const prizeText = prize ? `Your prize is ${prize}!!` : 'No luck this time...';
    this.say(`${isAuto ? 'Stopped automatically!' : ''} ${prizeText}`);
  }

  render() {
    return (
      <div className="machine">
        <div className="machine__wheels">
          { this.state.wheels.map((symbol, idx) => <Wheel key={idx} symbol={symbol} />) }
        </div>
        <p className="machine__message">{this.state.text}</p>
        <div className="machine__controls">
          <button className="machine__button_start" onClick={() => this.start()} disabled={this.state.stage === Stage.SPINNING}>Start</button>
          <button className="machine__button_stop" onClick={() => this.stop()} disabled={this.state.stage === Stage.READY}>Stop</button>
        </div>
      </div>
    );
  }
}

export default SlotMachine;
