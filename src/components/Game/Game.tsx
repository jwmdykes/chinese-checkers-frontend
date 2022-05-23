import React from 'react';
import './Game.css';

import Board from './Board/Board';
import MoveablePiece from './Piece/MoveablePiece';
import * as gameLogic from './gameLogic';
import * as gameSettings from './gameSettings';

interface GameProps {
  players: gameLogic.Player[];
  availColors: { [key: string]: gameSettings.Color };
  isSinglePlayer: boolean; // If true, the user can play moves for all players
}

interface GameState {
  rows: Array<Array<Number>>;
  selected: Array<Array<boolean>>;
  lastClicked: { x: number; y: number } | null;
  thisPlayerID: number; // which player are we? Can be modified so that we move each player's pieces.
  turn: number;
  hovered: { x: number; y: number } | null;
}

class Game extends React.Component<GameProps, GameState> {
  colors!: Array<gameSettings.Color>;
  moveableSquares!: null | [number, number][];
  lastUpClicked!: { x: number; y: number } | null;
  constructor(props: GameProps) {
    super(props);

    this.colors = Array(10).fill(this.props.availColors['empty']);
    for (let i = 0; i < this.props.players.length; i++) {
      this.colors[this.props.players[i].id] =
        gameSettings.colors[this.props.players[i].color];
    }

    this.state = {
      turn: this.props.players[0].id,
      thisPlayerID: this.props.players[0].id,
      rows: JSON.parse(
        JSON.stringify(gameSettings.StartingRows[this.props.players.length])
      ),
      selected: JSON.parse(JSON.stringify(gameSettings.StartingSelected)),
      lastClicked: null,
      hovered: null,
    };
  }

  pieceOnHover = (e: React.MouseEvent) => {
    console.log('HOVER');
    // console.log('HOVER!', e.nativeEvent.target as HTMLDivElement);

    const target = e.nativeEvent.target as HTMLDivElement;
    const clicked = JSON.parse(target.id);
    let newRows = JSON.parse(JSON.stringify(this.state.rows));
    // newRows[clicked.y][clicked.x] = 2;
    this.setState({
      rows: newRows,
      hovered: clicked,
    });
  };

  pieceOnLeave = (e: React.MouseEvent) => {
    // console.log('STOP HOVER!', e.nativeEvent.target as HTMLDivElement);

    const target = e.nativeEvent.target as HTMLDivElement;
    const clicked = JSON.parse(target.id);
    let newRows = JSON.parse(JSON.stringify(this.state.rows));
    // newRows[clicked.y][clicked.x] = 0;

    this.setState({
      rows: newRows,
      hovered: null,
    });
  };

  pieceOnMouseDown = (e: React.MouseEvent) => {
    console.log('MOUSE DOWN');
    e.preventDefault();

    // if it's not this player's turn, don't let them move
    if (this.state.turn !== this.state.thisPlayerID) {
      return;
    }

    const target = e.nativeEvent.target as HTMLSpanElement;
    const clicked = JSON.parse(target.id);
    let newLastClicked = JSON.parse(JSON.stringify(this.state.lastClicked));
    let newRows = JSON.parse(JSON.stringify(this.state.rows));
    let newSelected = JSON.parse(JSON.stringify(this.state.selected));
    let newTurn = this.state.turn;
    let newThisPlayerID = this.state.thisPlayerID;

    // if this is a click on the current player's piece select that piece,
    if (this.state.rows[clicked.y][clicked.x] === this.state.thisPlayerID) {
      newSelected = JSON.parse(JSON.stringify(gameSettings.StartingSelected));

      newSelected[clicked.y][clicked.x] = true;
      newLastClicked = clicked;
      this.moveableSquares = gameLogic.getMoveableSquares(this.state.rows, [
        clicked.x,
        clicked.y,
      ]);
      for (let square of this.moveableSquares) {
        newSelected[square[1]][square[0]] = true;
      }
    }
    // Otherwise, move the piece to the new square if it is a legal move
    else if (this.moveableSquares && this.state.lastClicked) {
      console.log('GO!');
      for (let square of this.moveableSquares) {
        if (square[0] === clicked.x && square[1] === clicked.y) {
          this.moveableSquares = null;
          newSelected = JSON.parse(
            JSON.stringify(gameSettings.StartingSelected)
          );
          newRows[this.state.lastClicked.y][this.state.lastClicked.x] = 0;
          newRows[clicked.y][clicked.x] = this.state.thisPlayerID;

          // change whose turn it is. If `isSinglePlayer` prop is set,
          // retain control of the pieces even after the player changes.
          newTurn = gameLogic.changeTurn(this.props.players, this.state.turn);
          newThisPlayerID = this.props.isSinglePlayer
            ? newTurn
            : this.state.thisPlayerID;
          break;
        }
      }
    }

    this.setState({
      turn: newTurn,
      thisPlayerID: newThisPlayerID,
      rows: newRows,
      selected: newSelected,
      lastClicked: newLastClicked,
    });
    return;
  };

  pieceOnMouseUp = (e: React.MouseEvent) => {
    console.log('MOUSE UP');
    const target = e.nativeEvent.target as HTMLSpanElement;
    const clicked = JSON.parse(target.id);
    let newLastClicked = JSON.parse(JSON.stringify(this.state.lastClicked));
    // deep copy rows
    let newRows = JSON.parse(JSON.stringify(this.state.rows));
    let newSelected = JSON.parse(JSON.stringify(this.state.selected));
    let newTurn = this.state.turn;
    let newThisPlayerID = this.state.thisPlayerID;

    // deselect piece if it has already be upclicked on once
    // for example, clicking (up and down) on a piece will select it
    // but the second time it will be deselected.
    if (
      this.lastUpClicked &&
      this.lastUpClicked.x === clicked.x &&
      this.lastUpClicked.y === clicked.y
    ) {
      newLastClicked = null;
      newSelected = JSON.parse(JSON.stringify(gameSettings.StartingSelected));
      this.moveableSquares = null;
      newSelected = JSON.parse(JSON.stringify(gameSettings.StartingSelected));
      this.lastUpClicked = null;
    } else {
      this.lastUpClicked = clicked;
    }

    // Move the piece if possible
    const hovered = this.state.hovered;
    if (this.moveableSquares && hovered) {
      for (let square of this.moveableSquares) {
        if (square[0] === hovered.x && square[1] === hovered.y) {
          this.moveableSquares = null;
          newSelected = JSON.parse(
            JSON.stringify(gameSettings.StartingSelected)
          );

          newRows[this.state.lastClicked!.y][this.state.lastClicked!.x] = 0;
          newRows[clicked.y][clicked.x] = this.state.thisPlayerID;

          // change whose turn it is. If `isSinglePlayer` prop is set,
          // retain control of the pieces even after the player changes.
          newTurn = gameLogic.changeTurn(this.props.players, this.state.turn);
          newThisPlayerID = this.props.isSinglePlayer
            ? newTurn
            : this.state.thisPlayerID;
          break;
        }
      }
    }

    this.setState({
      turn: newTurn,
      thisPlayerID: newThisPlayerID,
      rows: newRows,
      selected: newSelected,
      lastClicked: newLastClicked,
    });
  };

  render() {
    // console.log(this.state.rows);
    return (
      <div className='Game'>
        <Board
          rows={this.state.rows}
          selected={this.state.selected}
          colors={this.colors}
          pieceOnMouseDown={this.pieceOnMouseDown}
          pieceOnMouseUp={this.pieceOnMouseUp}
          pieceOnHover={this.pieceOnHover}
          pieceOnLeave={this.pieceOnLeave}
          turn={this.state.thisPlayerID}
          lastClicked={this.state.lastClicked}
        ></Board>
      </div>
    );
  }
}

export default Game;
