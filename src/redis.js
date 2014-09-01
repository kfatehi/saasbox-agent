var config = require('../etc/config').redis
  , redis = require("redis")
  , client = redis.createClient(config.port, config.host, config.options);

module.exports = client
