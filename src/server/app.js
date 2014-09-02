var logger = require('winston')
  , api = require('ydm-api')
  , httpProxy = require('http-proxy')
  , proxyServer = require('./proxy_server')

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true });

api.app.use('/api/v1/', require('./routes'));

module.exports = {
  api: {
    app: api.app,
    http: api.http
  },
  proxy: {
    app: proxyServer,
    http: require('http').createServer(proxyServer),
  }
}
