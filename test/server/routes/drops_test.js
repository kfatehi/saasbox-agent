process.env.STORAGE_PATH = '/tmp/saasbox-agent-test'
process.env.API_SECRET = 'secret'

var expect = require('chai').expect
  , request = require('supertest')
  , app = require('../../../src/server/app').api.app
  , target = require('../../../src/target')

describe("API v1 Routes", function() {
  beforeEach(function() {
    target.clearAll();
  });

  describe("DELETE /api/v1/proxies/:fqdn", function () {

    beforeEach(function(done) {
      target.set('bottom.middle.top', 'stuff', done)
    });

    describe("no token", function() {
      it("does not delete and returns 401 unauthorized", function(done) {
        request(app)
        .delete('/api/v1/proxies/bottom.middle.top')
        .send({ target: 'http://localhost:12345' })
        .expect(401)
        .end(function(err, res) {
          if (err) throw err;
          target.get('bottom.middle.top', function(err, reply) {
            expect(err).to.eq(null)
            expect(reply).to.eq('stuff')
            done()
          })
        })
      });
    });

    describe("wrong token", function() {
      it("does not delete the target and returns 401 unauthorized", function(done) {
        request(app)
        .delete('/api/v1/proxies/bottom.middle.top')
        .set('X-Auth-Token', 'password')
        .send({ target: 'http://localhost:12345' })
        .expect(401)
        .end(function(err, res) {
          if (err) throw err;
          target.get('bottom.middle.top', function(err, reply) {
            expect(err).to.eq(null)
            expect(reply).to.eq('stuff')
            done()
          })
        })
      });
    });

    describe("valid token", function() {
      it("deletes the proxy target and returns 204 no content", function(done) {
        request(app)
        .delete('/api/v1/proxies/bottom.middle.top')
        .set('X-Auth-Token', 'secret')
        .send({ target: 'http://localhost:12345' })
        .expect(204)
        .end(function(err, res) {
          if (err) throw err;
          target.get('bottom.middle.top', function(err, reply) {
            expect(err).to.eq(null)
            expect(reply).to.eq(null)
            done()
          })
        })
      });
    });
  })
})
