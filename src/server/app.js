var logger = require('winston')
  , express = require('express')
  , api = { app: express() }
  , httpProxy = require('http-proxy')
  , proxyServer = require('./proxy_server')

if (process.env.NODE_ENV === "development") {
  logger.info('development mode');

  api.app.use(function (req, res, next) {
    logger.info(req.method + " " + req.path);
    next();
  });
}

// Cross Domain
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN || "*");
  res.header("Access-Control-Expose-Headers", "X-Filename");
  res.header("Access-Control-Allow-Headers", "Referer, Range, Accept-Encoding, Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
};

api.app.use('/api/v1/', allowCrossDomain, require('./routes'));

module.exports = {
  api: {
    app: api.app,
    http: require('http').createServer(api.app)
  },
  proxy: {
    app: proxyServer,
    http: require('http').createServer(proxyServer),
    https: (function() {
      var https = null;
      if (process.env.SSL_KEY && process.env.SSL_CERT) {
        var read = require('fs').readFileSync;
        https = require('https').createServer({
          key: read(process.env.SSL_KEY),
          cert: read(process.env.SSL_CERT)
        }, proxyServer)
      }
      return https
    }())
  }
}
