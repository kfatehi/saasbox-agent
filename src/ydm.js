var path = require('path')
  , storage = require('./storage')
  , path = require('path')
  , dropsPath = path.join(__dirname, '..', 'drops')
  , scopesPath = path.join(storage.root, 'ydm', 'scopes')
  , Ydm = require('ydm')
  , logger = require('./logger')

logger.info('ydm drops path: '+dropsPath)
logger.info('ydm scopes path: '+scopesPath)

var ydm = new Ydm({
  scopesPath: scopesPath,
  dropsPath: dropsPath
});

var connector = ydm.dockerConnect;
connector.connect().docker.listContainers(function(err, res) {
  if (err) {
    logger.error("Docker connection failure", connector.options);
    throw err;
  } else {
    logger.info("Connected to Docker.")
  }
})

module.exports = ydm
