var expect = require('chai').expect
  , request = require('supertest')
  , app = require('../../../src/server/app').api.app
  , secret = require('../../../src/secret')

describe("POST /api/v1/drops/:name", function () {
  it("creates the proxy target and returns 204 no content", function(done) {
    request(app)
    .post('/api/v1/drops/foo')
    .set('X-Auth-Token', secret)
    .send('code()')
    .expect(201)
    .end(function(err, res) {
      if (err) throw err;
      expect(err).to.eq(null)
      done()
    })
  });
})
