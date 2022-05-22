import React from 'react';
import './Game.css';

import Board from './Board/Board';
import * as gameLogic from './gameLogic';
import * as gameSettings from './gameSettings';

interface GameProps {
  players: gameLogic.Player[];
  availColors: { [key: string]: string };
  isSinglePlayer: boolean; // If true, the user can play moves for all players
}

interface GameState {
  rows: Array<Array<Number>>;
  selected: Array<Array<boolean>>;
  thisPlayerID: number; // which player are we? Can be modified so that we move each player's pieces.
  turn: number;
}

class Game extends React.Component<GameProps, GameState> {
  colors!: Array<String>;
  constructor(props: GameProps) {
    super(props);

    this.colors = Array(10).fill(this.props.availColors['empty']);
    for (let i = 0; i < this.props.players.length; i++) {
      this.colors[this.props.players[i].id] = this.props.players[i].color;
    }
    console.log(this.colors);

    this.state = {
      turn: this.props.players[0].id,
      thisPlayerID: this.props.players[0].id,
      rows: gameSettings.StartingRows[this.props.players.length],
      selected: gameSettings.StartingSelected,
    };
  }

  onClick = (e: React.MouseEvent) => {
    const target = e.nativeEvent.target as HTMLSpanElement;
    const clicked = JSON.parse(target.id);

    // if it's not this player's turn, don't let them move the pieces
    if (this.state.turn !== this.state.thisPlayerID) {
      return;
    }

    // if this is the first click, show the squares which can be moved to after the click
    // const moveableSquares = gameLogic.getMoveableSquares(clicked);

    let newRows = JSON.parse(JSON.stringify(this.state.rows)); // don't modify in place
    newRows[clicked.y][clicked.x] = newRows[clicked.y][clicked.x] === 1 ? 0 : 1;
    let newSelected = JSON.parse(JSON.stringify(this.state.selected));
    newSelected[clicked.y][clicked.x] =
      newSelected[clicked.y][clicked.x] === true ? false : true;
    let newTurn = gameLogic.changeTurn(this.props.players, this.state.turn);
    let newThisPlayerID = this.props.isSinglePlayer
      ? newTurn
      : this.state.thisPlayerID;
    this.setState({
      rows: newRows,
      selected: newSelected,
      turn: newTurn,
      thisPlayerID: newThisPlayerID,
    });
    return;
  };

  render() {
    // console.log(this.state.rows);
    return (
      <Board
        rows={this.state.rows}
        selected={this.state.selected}
        colors={this.colors}
        onClick={this.onClick}
      ></Board>
    );
  }
}

export default Game;
