import config from './config';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import * as gameLogic from './gameLogic';

const connectToAPI = () => {
  const socket = io(
    `http${config.API_ISHTTPS ? 's' : ''}://${config.API_HOSTPORT}`,
    { secure: true }
  );
  console.log(`location of server is: ${config.API_HOSTPORT}`);
  return socket;
};

const createGame = () => {
  return axios.get(
    `http${config.API_ISHTTPS ? 's' : ''}://${
      config.API_HOSTPORT
    }/create/chinese-checkers`
  );
};

const joinGame = (
  gameID: string,
  socket: Socket,
  callback: (game: any) => any
) => {
  socket.emit('join', gameID);
  socket.on('join', (res: any) => {
    callback(res);
  });
};

const sendMove = (
  gameID: string,
  move: gameLogic.MoveObject,
  socket: Socket,
  turn: number,
  callback: (res: any) => any
) => {
  socket.emit('move', {
    gameID: gameID,
    move: move,
    turn: turn,
  });
  socket.on('move', (res) => [callback(res)]);
};

const listGames = () => {
  return axios.get(
    `http${config.API_ISHTTPS ? 's' : ''}://${
      config.API_HOSTPORT
    }/list-games/chinese-checkers`
  );
};

export default {
  connectToAPI: connectToAPI,
  createGame: createGame,
  joinGame: joinGame,
  listGames: listGames,
  sendMove: sendMove,
};
