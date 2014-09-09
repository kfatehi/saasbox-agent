var logger = require('winston')
  , target = require('../target')
  , httpProxy = require('http-proxy')
  , proxy = httpProxy.createProxyServer({})
  , URI = require('uri-js')

var handler = function (req, cb) {
  var fqdn = req.headers.host.split(':')[0]
  target.get(fqdn, function (err, target) {
    if (err) {
      logger.error(err.message+err.backtrace);
      return cb(function(res) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.write('Internal Gateway Error');
        res.end()
      })
    } else if (target) {
      var opts = { target: URI.parse(target) }
      cb(null, opts, fqdn)
    } else {
      logger.warn('No target defined for '+fqdn);
      return cb(function(res) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Not found\n');
        res.end();
      })
    }
  })
}

module.exports = require('http').createServer(function(req, res) {
  handler(req, function(err, opts, fqdn) {
    if (err) return err(res);
    proxy.web(req, res, opts);
    logger.info('Proxied HTTP '+fqdn+' => '+opts);
  })
}).on('upgrade', function(req, socket, head) {
  handler(req, function(err, opts, fqdn) {
    if (err) return false;
    proxy.ws(req, socket, head, opts);
    logger.info('Proxied WebSocket '+fqdn+' => '+opts);
  })
})
