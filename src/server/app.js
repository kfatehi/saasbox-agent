var logger = require('winston')
  , api = require('ydm-api')
  , httpProxy = require('http-proxy')
  , proxy = httpProxy.createProxyServer({})
  , proxyServer = require('./proxy_server')

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true });

api.app.use('/api/v1/', require('./routes'));

module.exports = {
  api: api.http,
  proxy: require('http').createServer(proxyServer)
}
