#!/usr/bin/env node
var logger = require('./src/logger')
  , app = require(__dirname+'/src/server/app.js')
  , target = require('./src/target')
  , fs = require('fs')
  , prod = process.env.NODE_ENV === 'production'
  , cluster = require('./src/cluster')
  , ydm = require('./src/ydm')

var dockerConnect = function(done) {
  return function() {
    var connector = ydm.dockerConnect;
    connector.connect().docker.listContainers(function(err) {
      if (err) {
        throw new Error("Docker connection failure "+JSON.stringify(connector.options)+", "+err.stack);
      } else {
        logger.info("Connected to Docker.")
      }
      done(err)
    })
  }
}

cluster(dockerConnect(function() {
  var ports = {
    api: { http: 4999 },
    proxy: {
      http: prod ? 80 : 4080,
      https: prod ? 443 : 4443
    }
  }

  if (process.env.CONTROL_FQDN) {
    target.set(process.env.CONTROL_FQDN, "http://127.0.0.1:"+ports.api.http, function(err) {
      logger.info('control api proxied as '+process.env.CONTROL_FQDN)
    })
  } else {
    logger.error("control api unreachable. Set CONTROL_FQDN to proxy the control api")
  }

  app.api.http.listen(ports.api.http, '127.0.0.1')
  logger.info("control api listening on http://127.0.0.1:"+ports.api.http);


  app.proxy.createServer().listen(ports.proxy.http);
  logger.info("proxy listening on http://0.0.0.0:"+ports.proxy.http);

  var proxyConfig = null;
  if (process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
    app.proxy.createServer({
      ssl: {
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH),
        secureProtocol: 'TLSv1_method'
      }
    }).listen(ports.proxy.https)
    logger.info("proxy listening on https://0.0.0.0:"+ports.proxy.https);
  } else {
    logger.warn('no ssl -- set SSL_KEY_PATH and SSL_CERT_PATH!')
  }
}))
