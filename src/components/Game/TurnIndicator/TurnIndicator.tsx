import React, { Component } from 'react';
import * as gameSettings from '../gameSettings';
import './TurnIndicator.css';

interface GameProps {
  colors: Array<gameSettings.Color>;
  turn: number;
}

class TurnIndicator extends Component<GameProps> {
  render() {
    let color = this.props.colors[this.props.turn];
    let backgroundColor: gameSettings.Color = {
      type: color.type,
      hue: color.hue,
      saturation: color.saturation,
      brightness: color.brightness + 15,
    };
    const backgroundColorString = gameSettings.colorString(backgroundColor);

    return (
      <div
        className='TurnIndicator'
        style={{
          background: backgroundColorString ? backgroundColorString : 'white',
        }}
      >
        It is Player {this.props.turn || 'Nobody'}'s turn to move.
      </div>
    );
  }
}

export default TurnIndicator;
