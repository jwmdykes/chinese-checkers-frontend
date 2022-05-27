import React, { Component } from 'react';
import './GameOverOverlay.css';
import * as gameLogic from '../gameLogic';
import * as gameSettings from '../gameSettings';
import GameButton from './GameButton';

interface GameOverIndicatorProps {
  colors: Array<gameSettings.Color>;
  winner: gameLogic.Player;
}

class GameOverIndicator extends Component<GameOverIndicatorProps> {
  render() {
    let color = this.props.colors[this.props.winner.id];
    let backgroundColor: gameSettings.Color = {
      type: color.type,
      hue: color.hue,
      saturation: color.saturation,
      brightness: color.brightness + 15,
    };
    const backgroundColorString = gameSettings.colorString(backgroundColor);

    return (
      <div
        className='GameOverIndicator UIBox'
        style={{ background: backgroundColorString }}
      >
        The Winner is Player {this.props.winner.id}!
      </div>
    );
  }
}

interface GameOverOverlayProps {
  winner: gameLogic.Player;
  colors: Array<gameSettings.Color>;
  clickCallback(e: React.MouseEvent): void;
}

export default class GameOverOverlay extends Component<GameOverOverlayProps> {
  render() {
    return (
      <div className='GameOverOverlay'>
        <GameOverIndicator
          winner={this.props.winner}
          colors={this.props.colors}
        ></GameOverIndicator>
        <GameButton
          extraClassNames='NewGameButton'
          text='New Game'
          clickCallback={this.props.clickCallback}
        ></GameButton>
      </div>
    );
  }
}
