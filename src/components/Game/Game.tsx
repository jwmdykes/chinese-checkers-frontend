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
  lastClicked: { x: number; y: number } | null;
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

    this.state = {
      turn: this.props.players[0].id,
      thisPlayerID: this.props.players[0].id,
      rows: gameSettings.StartingRows[this.props.players.length],
      selected: gameSettings.StartingSelected,
      lastClicked: null,
    };
  }

  pieceOnClick = (e: React.MouseEvent) => {
    // if it's not this player's turn, don't let them move
    if (this.state.turn !== this.state.thisPlayerID) {
      return;
    }

    const target = e.nativeEvent.target as HTMLSpanElement;
    const clicked = JSON.parse(target.id);
    let newLastClicked = JSON.parse(JSON.stringify(this.state.lastClicked));
    // deep copy rows
    let newRows = this.state.rows.map((arr) => {
      return arr.slice();
    });
    let newSelected = this.state.selected.map((arr) => {
      return arr.slice();
    });
    let newTurn = this.state.turn;
    let newThisPlayerID = this.state.thisPlayerID;

    // if this is the first click, and it's a click on a valid piece, select that piece
    if (this.state.rows[clicked.y][clicked.x] === this.state.thisPlayerID) {
      if (this.state.lastClicked !== null) {
        newSelected[this.state.lastClicked.y][this.state.lastClicked.x] = false;
      }
      newSelected[clicked.y][clicked.x] = true;
      newLastClicked = clicked;
      // Todo: highlight valid moves
    }

    // newRows[clicked.y][clicked.x] = newRows[clicked.y][clicked.x] === 1 ? 0 : 1;
    // gameLogic.changeTurn(this.props.players, this.state.turn);
    // newThisPlayerID = this.props.isSinglePlayer
    //   ? newTurn
    //   : this.state.thisPlayerID;

    this.setState({
      turn: newTurn,
      thisPlayerID: newThisPlayerID,
      rows: newRows,
      selected: newSelected,
      lastClicked: newLastClicked,
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
        pieceOnClick={this.pieceOnClick}
      ></Board>
    );
  }
}

export default Game;
