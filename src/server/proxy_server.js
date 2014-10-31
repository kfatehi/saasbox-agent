var logger = require('../logger')
  , target = require('../target')
  , httpProxy = require('http-proxy')
  , proxy = httpProxy.createProxyServer({})
  , URI = require('uri-js')

proxy.on('error', function(e) {
  logger.error('Proxy error: '+e.message+'\n'+e.stack)
});

var gatewayError = function(res) {
  res.writeHead(502, { 'Content-Type': 'text/plain' });
  res.write('Internal Gateway Error');
  res.end()
}

var notFound = function(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.write('Not found\n');
  res.end();
}

var handler = function (req, cb) {
  var host = req.headers.host
  if (!host) return cb(notFound);
  var fqdn = req.headers.host.split(':')[0]
  target.get(fqdn, function (err, target) {
    if (err) {
      logger.error(err.message+err.backtrace);
      return cb(gatewayError)
    } else if (target) {
      var opts = { target: URI.parse(target) }
      cb(null, opts, fqdn)
    } else {
      logger.warn('No target defined for '+fqdn);
      return cb(notFound)
    }
  })
}

var serverCallback = function(req, res) {
  handler(req, function(err, opts, fqdn) {
    if (err) return err(res);
    proxy.web(req, res, opts);
    logger.info('Proxied HTTP '+fqdn+' => '+opts.target.scheme+'://'+opts.target.host+':'+opts.target.port);
  })
}

module.exports = function(config) {
  var server = null;
  if (config && config.ssl) {
    server = require('https').createServer(config.ssl, serverCallback)
  } else {
    server = require('http').createServer(serverCallback)
  }
  server.on('upgrade', function(req, socket, head) {
    handler(req, function(err, opts, fqdn) {
      if (err) return false;
      proxy.ws(req, socket, head, opts);
      logger.info('Proxied WebSocket '+fqdn+' => '+opts.target.scheme+'://'+opts.target.host+':'+opts.target.port);
    })
  })
  return server;
}
