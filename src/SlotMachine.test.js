import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import SlotMachine from './SlotMachine';
import Wheel from './Wheel';
import Stage from './Stage';

configure({adapter: new Adapter()});

describe('<SlotMachine />', () => {
  test('renders three <Wheel /> components', () => {
    const wrapper = shallow(<SlotMachine />);
    expect(wrapper.find(Wheel)).toHaveLength(3);
  });
  
  test('creates an autostart timer on mount', () => {
    const wrapper = shallow(<SlotMachine />);
    const instance = wrapper.instance();
    expect(instance.timers.autoStart).toBeTruthy();
  });

  describe('#say()', () => {
    test('adds output text to state', () => {
      const testText = 'test';
      const wrapper = shallow(<SlotMachine />);
      const instance = wrapper.instance();
      instance.say(testText);
      expect(wrapper.state().text).toBe(testText);
    })
  });

  describe('* wheelGenerator()', () => {
    test('returns predictable result', () => {
      const testValue = 'S';
      const wrapper = shallow(<SlotMachine />);
      const instance = wrapper.instance();
      const generator = instance.wheelGenerator([testValue]);
      expect(generator.next().value).toBe(testValue);
    });
  })

  describe('#getRandomWheels()', () => {
      test('returns array of length 3', () => {
        const wrapper = shallow(<SlotMachine />);
        const instance = wrapper.instance();
        expect(instance.getRandomWheels()).toHaveLength(instance.numOfWheels);
      });
  });

  describe('#pickRandomIndex()', () => {
    test('returns index 0 for a single-element array', () => {
      const wrapper = shallow(<SlotMachine />);
      const instance = wrapper.instance();
      expect(instance.pickRandomIndex(['S'])).toBe(0);
    });
  });

  describe('#pickRandomItem()', () => {
    test('returns single element of array', () => {
      const wrapper = shallow(<SlotMachine />);
      const instance = wrapper.instance();
      expect(instance.pickRandomItem(['S'])).toBe('S');
    });
  });

  describe('#calculatePrize()', () => {
    const wrapper = shallow(<SlotMachine />);
    const instance = wrapper.instance();

    test('returns 100 when all three symbols are equal', () => {
      expect(instance.calculatePrize(['S', 'S', 'S'])).toBe(100);
    });

    test('returns 20 when there are two consecutive symbols', () => {
      expect(instance.calculatePrize(['B', 'S', 'S'])).toBe(20);
    });

    test('returns 10 when two non-consecutive symbols are equal', () => {
      expect(instance.calculatePrize(['S', 'B', 'S'])).toBe(10);
    });

    test('returns 100 when all three symbols are equal', () => {
      expect(instance.calculatePrize(['S', 'S', 'S'])).toBe(100);
    });
  });

  describe('#start()', () => {
    const wrapper = shallow(<SlotMachine />);
    const instance = wrapper.instance();
    instance.start();

    test('sets spinner interval', () => {
      expect(instance.timers.spinner).toBeTruthy();
    });

    test('sets stage=spinning', () => {
      expect(wrapper.state().stage).toBe(Stage.SPINNING);
    });
  });

  describe('#stop()', () => {
    const wrapper = shallow(<SlotMachine />);
    const instance = wrapper.instance();
    instance.stop();

    test('sets stage=ready', () => {
      expect(wrapper.state().stage).toBe(Stage.READY);
    });
  });
});
