import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';

import { getMetricMetaInfo, timeToString } from '../utils/helpers';
import UdaciSlider from './UdaciSlider';
import UdaciSteppers from './UdaciSteppers';
import DateHeader from './DateHeader';
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api';

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>SUBMIT</Text>
    </TouchableOpacity>
  );
}

export default class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  }

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState(state => {
      const count = state[metric] + step;
      return {
        [metric]: count > max ? max : count
      };
    });
  }

  decrement = (metric) => {
    const { step } = getMetricMetaInfo(metric);

    this.setState(state => {
      const count = state[metric] - step;
      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      };
    });
  }

  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value
    }));
  }

  submit = () => {
    const key = timeToString();
    const entry = this.state;

    this.setState(() => ({
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0
    }));

    submitEntry({ key, entry });

    // TODO:
    //  - Update Redux
    //  - Navigate to home
    //  - Clear local notification
  }

  reset = () => {
    const key = timeToString();

    removeEntry(key);

    // TODO:
    //  - Update Redux
    //  - Route to home
  }

  render() {
    const metaInfo = getMetricMetaInfo();

    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons
            name='ios-happy-outline'
            size={100}
          />
          <Text>You already logged your information for today</Text>
          <TextButton onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      );
    }

    return (
      <View>
        <DateHeader date={moment().format('L')}/>
        {Object.keys(metaInfo).map((key) => {
          const {getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];

          return(
            <View key={key}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider
                    value={value}
                    onChange={(value) => this.slide(key, value)}
                    {...rest}
                  />
                : <UdaciSteppers
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                  />
              }
            </View>
          );
        })}

        <SubmitBtn onPress={this.submit}/>
      </View>
    );
  }
}
