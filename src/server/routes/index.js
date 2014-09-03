var router = require('express').Router()
require('./proxies')(router)
require('./drops')(router)
module.exports = router
