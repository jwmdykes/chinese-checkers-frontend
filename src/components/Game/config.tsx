// api server configuration
const port = process.env.REACT_APP_PORT;
const ip = process.env.REACT_APP_IP;
const host = process.env.REACT_APP_HOST;
const ishttps = process.env.REACT_APP_ISHTTPS === '1';

const config = {
  API_PORT: port,
  API_IP: ip,
  API_HOST: host,
  API_HOSTPORT: host + ':' + port,
  API_ISHTTPS: ishttps,
};

export default config;
