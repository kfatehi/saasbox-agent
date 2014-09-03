var path = require('path')
  , storage = require('./storage')
  , path = require('path')
  , dropsPath = path.join(storage.root, 'ydm', 'drops')
  , scopesPath = path.join(storage.root, 'ydm', 'scopes')
  , Ydm = require('ydm')
  , logger = require('winston')

logger.info('ydm drops path: '+dropsPath)
logger.info('ydm scopes path: '+scopesPath)

module.exports = new Ydm({
  scopesPath: scopesPath,
  dropsPath: dropsPath
});
