var version = require('../../../package').version;
var router = require('express').Router()
router.get('/version', function(req, res) {
  res.json({ version: version });
})
require('./proxies')(router)
require('./drops')(router)
module.exports = router
