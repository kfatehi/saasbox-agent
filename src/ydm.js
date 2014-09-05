var path = require('path')
  , storage = require('./storage')
  , path = require('path')
  , dropsPath = path.join(storage.root, 'ydm', 'drops')
  , scopesPath = path.join(storage.root, 'ydm', 'scopes')
  , Ydm = require('ydm')
  , logger = require('winston')

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
  }
})

module.exports = ydm
