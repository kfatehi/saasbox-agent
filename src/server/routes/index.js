var version = require('../../../package').version
  , router = module.exports = require('express').Router()
  , sss = require('simple-stats-server')

router.use('/stats', sss())
router.get('/version', function(req, res) {
  res.json({ version: version });
})
require('./proxies')(router)
require('./drops')(router)
