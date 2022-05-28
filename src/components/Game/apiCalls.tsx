import config from './config';
import { io } from 'socket.io-client';
import axios from 'axios';

const connectToAPI = () => {
  const socket = io(config.API_HOSTPORT);
  console.log(config.API_HOSTPORT);
  return socket;
};

const createGame = () => {
  return axios.get(`http://${config.API_HOSTPORT}/create/chinese-checkers`);
};

const joinGame = (gameID: string, socket: any) => {
  socket.emit('join', gameID);
};

const listGames = () => {
  return axios.get(`http://${config.API_HOSTPORT}/list-games/chinese-checkers`);
};

export default {
  connectToAPI: connectToAPI,
  createGame: createGame,
  joinGame: joinGame,
};
