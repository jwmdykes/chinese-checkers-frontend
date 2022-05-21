import React from 'react';
import './Game.css';

import Board from './Board/Board';

interface GameProps {}

interface GameState {
  board: Array<[Number, Number]>;
}

const getEmptyBoard = (): Array<[Number, Number]> => {
  return Array([1, 3]);
};

class Game extends React.Component<GameProps, GameState> {
  state = { board: getEmptyBoard() };
  render() {
    return <Board board={this.state.board}></Board>;
  }
}

export default Game;
