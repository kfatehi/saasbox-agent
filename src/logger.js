var logger = require('winston')
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true });
module.exports = logger;
