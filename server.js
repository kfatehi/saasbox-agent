#!/usr/bin/env node
var logger = require('winston')
  , app = require(__dirname+'/src/server/app.js')
  , target = require('./src/target')
  , addr = '0.0.0.0'

ports = {
  api: {
    http: process.env.CONTROL_PORT || 4000
  },
  proxy: {
    http: process.env.PROXY_HTTP_PORT || 4080,
    https: process.env.PROXY_HTTPS_PORT || 4443
  }
}

if (process.env.CONTROL_FQDN) {
  target.set(process.env.CONTROL_FQDN, "http://"+addr+":"+ports.api.http, function(err) {
    logger.info('control api proxied to '+process.env.CONTROL_FQDN)
  })
} else {
  logger.warn("pass CONTROL_FQDN to proxy the control api")
}

app.api.http.listen(ports.api.http, addr)
logger.info("control api listening on http://"+addr+":"+ports.api.http);


app.proxy.http.listen(ports.proxy.http, addr)
logger.info("proxy listening on http://"+addr+":"+ports.proxy.http);

if (app.proxy.https) {
  app.proxy.https.listen(ports.proxy.https, addr)
  logger.info("proxy listening on http://"+addr+":"+ports.proxy.https);
} else {
  logger.warn('no SSL')
}
