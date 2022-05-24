import React, { Component } from 'react';
import './GameOverOverlay.css';

interface NewGameButtonProps {
  clickCallback(e: React.MouseEvent): void;
}

class NewGameButton extends Component<NewGameButtonProps> {
  render() {
    return (
      <div className='NewGameButton UIBox' onClick={this.props.clickCallback}>
        New Game
      </div>
    );
  }
}

interface GameOverOverlayProps {}

class GameOverIndicator extends Component {
  render() {
    return (
      <div className='GameOverIndicator UIBox'>The Winner is Player 1!</div>
    );
  }
}

interface GameOverOverlayProps {
  clickCallback(e: React.MouseEvent): void;
}

export default class GameOverOverlay extends Component<GameOverOverlayProps> {
  render() {
    return (
      <div className='GameOverOverlay'>
        <GameOverIndicator></GameOverIndicator>
        <NewGameButton clickCallback={this.props.clickCallback}></NewGameButton>
      </div>
    );
  }
}
