var secret = require('../../secret')

module.exports = function(req, res, next) {
  if (!secret) next();
  else {
    if (req.get('X-Auth-Token') === secret) next();
    else res.status(401).end();
  }
}
