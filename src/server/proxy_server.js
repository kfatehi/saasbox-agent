var logger = require('winston')
  , target = require('../target')
  , httpProxy = require('http-proxy')
  , proxy = httpProxy.createProxyServer({})

module.exports = function (req, res) {
  var fqdn = req.headers.host.split(':')[0]
  target.get(fqdn, function (err, target) {
    if (err) {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.write('Internal Gateway Error');
      res.end()
    } else if (target === null) {
      logger.warn('No target defined for '+fqdn);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('Not found\n');
      res.end();
    } else {
      logger.info('Proxying '+fqdn+' => '+target);
      proxy.web(req, res, { target: target, ws: true });
    }
  })
}
