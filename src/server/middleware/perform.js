var ydm = require('../../ydm')
  , path = require('path')
  , _ = require('lodash')

module.exports = function(req, res, next) {
  var performer = ydm.performer(req.params.name, req.body)
  if (performer.canPerform(req.params.action)) {
    performer.perform(req.params.action, function(err, out) {
      if (err) {
        res.status(500)
        if (err.syscall === 'connect') {
          res.end('Cannot connect to Docker'); 
        } else {
          res.end(err.message)
        }
      } if (out) {
        res.status(200)
        if (_.isObject(out)) {
          res.json(out);
        } else {
          var json = null;
          try {
            json = JSON.parse(out)
          } catch (e) {
            /* handle error */
          } finally {
            if (json) res.json(json);
            else res.end(out);
          }
        }
      } else {
        res.status(500).end();
      }
    })
  } else {
    res.status(500).end("Unavailable action: "+req.params.action);
  }
}
