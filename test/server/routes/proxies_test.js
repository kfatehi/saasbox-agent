process.env.API_SECRET = 'secret'

var expect = require('chai').expect
  , request = require('supertest')
  , app = require('../../../src/server/app').api.app
  , target = require('../../../src/target')

describe("API v1 Routes", function() {
  beforeEach(function() {
    target.clearAll();
  });

  describe("POST /api/v1/proxies/:fqdn", function () {
    describe("no token", function() {
      it("does not add the target and returns 401 unauthorized", function(done) {
        request(app)
        .post('/api/v1/proxies/bottom.middle.top')
        .send({ target: 'http://localhost:12345' })
        .expect(401)
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

    describe("wrong token", function() {
      it("does not add the target and returns 401 unauthorized", function(done) {
        request(app)
        .post('/api/v1/proxies/bottom.middle.top')
        .set('X-Auth-Token', 'password')
        .send({ target: 'http://localhost:12345' })
        .expect(401)
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

    describe("valid token", function() {
      it("creates the proxy target and returns 201 created", function(done) {
        request(app)
        .post('/api/v1/proxies/bottom.middle.top')
        .set('X-Auth-Token', 'secret')
        .send({ target: 'http://localhost:12345' })
        .expect(201)
        .end(function(err, res) {
          if (err) throw err;
          target.get('bottom.middle.top', function(err, reply) {
            expect(err).to.eq(null)
            expect(reply).to.eq('http://localhost:12345')
            done()
          })
        })
      });
    });
  })
});
