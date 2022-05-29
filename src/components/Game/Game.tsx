import React from 'react';
import './Game.css';

import Board from './Board/Board';
import TurnIndicator from './TurnIndicator/TurnIndicator';
import * as gameLogic from './gameLogic';
import * as gameSettings from './gameSettings';
import GameOverOverlay from './GameOverIndicator/GameOverOverlay';
import GameButton from './GameOverIndicator/GameButton';
import API from './apiCalls';
import { Socket } from 'socket.io-client';
import classNames from 'classnames';

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
  gameIsOver: boolean;
  gameNotJoined: boolean;
  winner: null | gameLogic.Player;
  gameID: string | null;
  numTargetPlayers: number | null;
  players: gameLogic.Player[];
}

class Game extends React.Component<GameProps, GameState> {
  moveCounter: number = 0;
  socket: Socket | null = null;
  colors!: Array<gameSettings.Color>;
  moveableSquares: null | [number, number][] = null;
  lastUpClicked: { x: number; y: number } | null = null;
  clickSound: HTMLAudioElement = new Audio(
    '/sounds/game-sound-effects-click.wav'
  );
  buttonSound: HTMLAudioElement = new Audio(
    '/sounds/506052__mellau__button-click-3.wav'
  );
  constructor(props: GameProps) {
    super(props);

    this.colors = Array(10).fill(this.props.availColors['empty']);
    for (let i = 0; i < this.props.players.length; i++) {
      this.colors[this.props.players[i].id] =
        gameSettings.colors[this.props.players[i].color];
    }

    this.clickSound.volume = 0.7;
    this.buttonSound.volume = 0.5;

    this.state = {
      players: [],
      numTargetPlayers: null,
      gameID: null,
      winner: null,
      gameIsOver: false,
      gameNotJoined: true,
      turn: this.props.players[0].id,
      thisPlayerID: this.props.players[0].id,
      // rows: JSON.parse(
      //   JSON.stringify(gameSettings.StartingRows[this.props.players.length])
      // ),
      rows: JSON.parse(JSON.stringify(gameSettings.AlmostGameOverRow)),
      selected: JSON.parse(JSON.stringify(gameSettings.StartingSelected)),
      lastClicked: null,
      hovered: null,
    };
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  resetGame = () => {
    this.buttonSound.play();
    this.setState({
      winner: null,
      gameNotJoined: true,
      gameIsOver: false,
      turn: this.props.players[0].id,
      thisPlayerID: this.props.players[0].id,
      rows: JSON.parse(
        JSON.stringify(gameSettings.StartingRows[this.props.players.length])
      ),
      selected: JSON.parse(JSON.stringify(gameSettings.StartingSelected)),
      lastClicked: null,
      hovered: null,
    });
  };

  checkGameOver = (rows: Array<Array<Number>>) => {
    let newWinner = gameLogic.getWinner(rows, this.props.players);
    // console.log('winner is: ', newWinner);
    if (newWinner) {
      this.setState({
        gameIsOver: true,
        winner: newWinner,
      });
    }
  };

  changeTurn = () => {
    // change whose turn it is. If `isSinglePlayer` prop is set,
    // retain control of the pieces even after the player changes.
    // console.log('players: ', this.props.players);
    let newTurn = gameLogic.changeTurn(this.props.players, this.state.turn);
    let newThisPlayerID = this.props.isSinglePlayer
      ? newTurn
      : this.state.thisPlayerID;
    newThisPlayerID = this.state.thisPlayerID; // don't change turns

    this.setState({
      turn: newTurn,
      thisPlayerID: newThisPlayerID,
    });
  };

  tryMovePiece = (
    player: gameLogic.Player,
    source: { x: number; y: number },
    dest: { x: number; y: number }
  ): void => {
    // try to move the piece `source` to `dest`
    if (!this.moveableSquares) {
      return;
    }

    for (let square of this.moveableSquares) {
      if (square[0] === dest.x && square[1] === dest.y) {
        // send move to server, if we're in an online game
        if (this.state.gameID && this.socket) {
          this.sendMove({ player: player, source: source, dest: dest });
        }

        this.moveableSquares = null;
        let newSelected = JSON.parse(
          JSON.stringify(gameSettings.StartingSelected)
        );

        let newRows = gameLogic.updateRows(
          this.state.rows,
          source,
          dest,
          player
        );

        this.clickSound.play();

        this.setState({
          rows: newRows,
          selected: newSelected,
        });

        this.checkGameOver(newRows);

        this.changeTurn();

        break;
      }
    }
  };

  tryAcceptMovedPiece = (
    player: gameLogic.Player,
    source: { x: number; y: number },
    dest: { x: number; y: number }
  ): void => {
    // try to move the piece `source` to `dest`
    if (!this.moveableSquares) {
      return;
    }

    for (let square of this.moveableSquares) {
      if (square[0] === dest.x && square[1] === dest.y) {
        this.moveableSquares = null;
        let newSelected = JSON.parse(
          JSON.stringify(gameSettings.StartingSelected)
        );

        let newRows = gameLogic.updateRows(
          this.state.rows,
          source,
          dest,
          player
        );

        this.clickSound.play();

        this.setState({
          rows: newRows,
          selected: newSelected,
        });

        this.checkGameOver(newRows);

        this.changeTurn();

        break;
      }
    }
  };

  pieceOnHover = (e: React.MouseEvent) => {
    // console.log('HOVER');
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
      console.log(
        `turn is: ${this.state.turn} but this player is: ${this.state.thisPlayerID}`
      );
      return;
    }

    const target = e.nativeEvent.target as HTMLSpanElement;
    const clicked = JSON.parse(target.id);

    console.log(`clicked: ${clicked}`);

    // if this is a click on the current player's piece select that piece,
    if (this.state.rows[clicked.y][clicked.x] === this.state.thisPlayerID) {
      let newSelected = JSON.parse(
        JSON.stringify(gameSettings.StartingSelected)
      );

      newSelected[clicked.y][clicked.x] = true;
      let newLastClicked = clicked;
      this.moveableSquares = gameLogic.getMoveableSquares(this.state.rows, [
        clicked.x,
        clicked.y,
      ]);
      for (let square of this.moveableSquares) {
        newSelected[square[1]][square[0]] = true;
      }
      this.setState({
        selected: newSelected,
        lastClicked: newLastClicked,
      });
    }
    // Otherwise, move the piece to the new square if it is a legal move
    else if (this.moveableSquares && this.state.lastClicked) {
      this.tryMovePiece(
        this.props.players[this.state.thisPlayerID - 1],
        this.state.lastClicked,
        clicked
      );
    }
  };

  pieceOnMouseUp = (e: React.MouseEvent) => {
    console.log('MOUSE UP');
    e.preventDefault();
    const target = e.nativeEvent.target as HTMLSpanElement;
    const clicked = JSON.parse(target.id);

    // deselect piece if it has already be upclicked on once
    // for example, clicking (up and down) on a piece will select it
    // but the second time it will be deselected.
    if (
      this.lastUpClicked &&
      this.lastUpClicked.x === clicked.x &&
      this.lastUpClicked.y === clicked.y
    ) {
      this.moveableSquares = null;
      this.lastUpClicked = null;
      this.setState({
        selected: JSON.parse(JSON.stringify(gameSettings.StartingSelected)),
        lastClicked: null,
      });
    } else {
      this.lastUpClicked = clicked;
    }

    // Move the piece if possible
    const hovered = this.state.hovered;
    if (this.moveableSquares && hovered && this.state.lastClicked) {
      this.tryMovePiece(
        this.props.players[this.state.thisPlayerID - 1],
        this.state.lastClicked,
        hovered
      );
    }
  };

  receiveJoinGame = (response: any) => {
    // console.log('joining game ', response, 'in react component UI');
    this.setState({
      thisPlayerID: response.player.id,
      rows: response.game.rows,
      gameID: response.game.gameID,
      gameNotJoined: false,
      turn: response.game.turn,
      numTargetPlayers: response.game.numTargetPlayers,
      players: response.game.players,
    });
    // listen to game udpates
    this.socket!.on('move', this.receievemove);
    this.socket!.on('newPlayer', this.handleConnection);
    this.socket!.on('playerLeft', this.handleDisconnection);
  };

  handleConnection = (data: gameLogic.GameObject) => {
    console.log('new players: ', data.players);
    this.setState({
      players: data.players,
    });
  };

  handleDisconnection = (data: gameLogic.GameObject) => {
    console.log('new players: ', data.players);
    this.setState({
      players: data.players,
    });
  };

  receievemove = (data: { gameID: string; move: gameLogic.MoveObject }) => {
    console.log('received move: ', data.move);
    this.moveableSquares = gameLogic.getMoveableSquares(this.state.rows, [
      data.move.source.x,
      data.move.source.y,
    ]);
    this.tryAcceptMovedPiece(
      data.move.player,
      data.move.source,
      data.move.dest
    );
  };

  sendMove = (move: gameLogic.MoveObject) => {
    console.log('sending move!', this.moveCounter);
    this.moveCounter += 1;
    if (this.state.gameID && this.socket) {
      API.sendMove(
        this.state.gameID,
        move,
        this.socket,
        this.state.turn,
        this.receievemove
      );
    }
  };

  sendCreateOrJoinGame = () => {
    if (!this.state.gameNotJoined) {
      console.log('Already joined game.');
      return;
    }

    if (!this.socket) {
      this.socket = API.connectToAPI();
    }

    API.listGames().then((res) => {
      console.log('games: ', res.data);
      const gameID = gameLogic.getFirstAvailableGame(res.data);
      if (gameID && this.socket) {
        console.log('joining existing game: ', gameID);
        API.joinGame(gameID, this.socket, this.receiveJoinGame); // send join request for game
      } else if (this.socket) {
        API.createGame().then((res) => {
          if (this.socket) {
            const gameID = gameLogic.getFirstAvailableGame(res.data);
            console.log('joining created game: ', gameID);
            API.joinGame(gameID, this.socket, this.receiveJoinGame); // send join request for game
          }
        });
      }
    });
  };

  render() {
    // console.log(this.state.rows);
    return (
      <div className='Align'>
        <div className='GameContainer'>
          <div className='Game'>
            <div
              className='BlurContainer'
              style={{
                filter:
                  this.state.gameIsOver || this.state.gameNotJoined
                    ? 'blur(4px)'
                    : 'none',
              }}
            >
              <Board
                rows={this.state.rows}
                selected={this.state.selected}
                colors={this.colors}
                pieceOnMouseDown={this.pieceOnMouseDown}
                pieceOnMouseUp={this.pieceOnMouseUp}
                pieceOnHover={this.pieceOnHover}
                pieceOnLeave={this.pieceOnLeave}
                turn={this.state.turn}
              ></Board>
            </div>
            {this.state.gameNotJoined || this.state.gameIsOver || (
              <TurnIndicator
                colors={this.colors}
                turn={this.state.turn}
              ></TurnIndicator>
            )}
            {this.state.gameNotJoined ||
              this.state.gameIsOver ||
              this.state.numTargetPlayers === this.state.players.length || (
                <div className='NumPlayersIndicator'>
                  <p>Game ID: {this.state.gameID?.slice(0, 6)}</p>
                  <p>
                    Players: {this.state.players.length}/
                    {this.state.numTargetPlayers}
                  </p>
                  <p>You are Player {this.state.thisPlayerID}</p>
                </div>
              )}

            {!this.state.gameIsOver || (
              <GameOverOverlay
                clickCallback={this.resetGame}
                winner={this.state.winner!}
                colors={this.colors}
              ></GameOverOverlay>
            )}
            {!this.state.gameNotJoined || (
              <GameButton
                extraClassNames={classNames('JoinGameButton')}
                text='Create Or Join Game'
                clickCallback={this.sendCreateOrJoinGame}
              ></GameButton>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
