var common = require('upstreamapp-common')
var config = {
  logger: {
    papertrail: {
      host: 'logs2.papertrailapp.com',
      port: 22069
    }
  }
}

module.exports = process.env.NODE_ENV === 'production' ? common(config) : common()
