var target = require('../../target')
  , ydmApi = require('ydm-api')
  , bodyParser = require('body-parser')

module.exports = function (r) { r.route('/proxies/:fqdn')

  /* env var YDM_API_SECRET must match header X-Auth-Token */
  .all(ydmApi.middleware.authorize)

  /* POST /proxies/:fqdn
   * Set a proxy target
   * Expected JSON e.g.{ target: 'http://localhost:1234' } */
  .post(bodyParser.json(), function (req, res) {
    target.set(req.params.fqdn, req.body.target, function (err) {
      if (err) res.status(500).end();
      else res.status(200).end();
    })
  })
}

