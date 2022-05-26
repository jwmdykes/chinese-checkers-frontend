import config from './config';
import { io } from 'socket.io-client';

const connectToAPI = () => {
  const socket = io(config.API_HOSTPORT);
  console.log(config.API_HOSTPORT);
  return socket;
};

export default connectToAPI;
