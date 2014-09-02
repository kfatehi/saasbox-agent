#!/usr/bin/env node
var logger = require('winston')
  , app = require(__dirname+'/src/server/app.js')
  , addr = '0.0.0.0'
  , proxyPort = process.env.PORT || 4000
  , apiPort = proxyPort+1


app.proxy.listen(proxyPort, addr)
logger.info("proxy listening on http://"+addr+":"+proxyPort);

app.api.http.listen(apiPort, addr)
logger.info("api listening on http://"+addr+":"+apiPort);
