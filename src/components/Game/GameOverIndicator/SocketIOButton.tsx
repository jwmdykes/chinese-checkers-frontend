// Button to join game
import React, { Component } from 'react';
import './GameOverOverlay.css';
import * as gameLogic from '../gameLogic';
import * as gameSettings from '../gameSettings';

interface SocketIOButtonProps {
  clickCallback(e: React.MouseEvent): void;
}

class SocketIOButton extends Component<SocketIOButtonProps> {
  render() {
    return (
      <div className='NewGameButton UIBox' onClick={this.props.clickCallback}>
        Connect to Socket!
      </div>
    );
  }
}

export default SocketIOButton;
