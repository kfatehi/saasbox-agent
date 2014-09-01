var client = require('./redis')
  , logger = require('winston')
  , cache = {}

module.exports = {
  /* Get proxy target */
  get: function (fqdn, cb) {
    if (cache[fqdn]) cb(null, cache[fqdn]);
    else {
      client.get('proxy:'+fqdn, function (err, reply) {
        if (err) {
          logger.error('Redis returned an error looking for '+fqdn);
          logger.error(err.stack);
          cb(err);
        } else if (reply === null) {
          cb(null, null)
        } else {
          cache[fqdn] = reply;
          cb(null, reply)
        }
      })
    }
  },

  /* Set a proxy target */
  set: function (fqdn, target, cb) {
    client.set('proxy:'+fqdn, target, function (err, reply) {
      if (err) {
        logger.error(err.stack)
        cb(err)
      } else {
        cache[fqdn] = target;
        logger.info('set proxy:'+host+' => '+target)
        cb(null, target);
      }
    })
  }
}
