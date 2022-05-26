// api server configuration
const port = process.env.PORT || 3000;
const ip = process.env.IP || 'localhost';
const host = process.env.HOST || 'localhost';

module.exports = {
  API_PORT: port,
  API_IP: ip,
  API_HOST: host,
  API_HOSTPORT: host + ':' + ip,
};
