// Button to join game
import React, { Component } from 'react';
import './GameOverOverlay.css';
import * as gameLogic from '../gameLogic';
import * as gameSettings from '../gameSettings';

interface GameButtonButtonProps {
  text: string;
  clickCallback(e: React.MouseEvent): void;
  extraClassNames: string;
}

class GameButton extends Component<GameButtonButtonProps> {
  render() {
    return (
      <div
        className={'GameButton UIBox ' + this.props.extraClassNames}
        onClick={this.props.clickCallback}
      >
        {this.props.text}
      </div>
    );
  }
}

export default GameButton;
