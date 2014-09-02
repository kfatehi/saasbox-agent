var logger = require('winston')
  , api = require('ydm-api')
  , httpProxy = require('http-proxy')
  , proxyServer = require('./proxy_server')

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true });

api.app.use('/api/v1/', require('./routes'));

var https = null;
if (process.env.SSL_KEY && process.env.SSL_CERT) {
  var read = require('fs').readFileSync;
  https = require('https').createServer({
    key: read(process.env.SSL_KEY),
    cert: read(process.env.SSL_CERT)
  }, app.proxy.app)
}

module.exports = {
  api: {
    app: api.app,
    http: api.http
  },
  proxy: {
    app: proxyServer,
    http: require('http').createServer(proxyServer),
    https: https
  }
}
