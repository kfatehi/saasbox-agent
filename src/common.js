module.exports = require('upstreamapp-common')({
  logger: {
    papertrail: {
      host: 'logs2.papertrailapp.com',
      port: 22069
    }
  }
})
