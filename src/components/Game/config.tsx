// api server configuration
const port = process.env.PORT || 5000;
const ip = process.env.IP || 'localhost';
const host = process.env.HOST || 'localhost';

const config = {
  API_PORT: port,
  API_IP: ip,
  API_HOST: host,
  API_HOSTPORT: host + ':' + port,
};

export default config;
