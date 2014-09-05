var expect = require('chai').expect
  , request = require('supertest')
  , app = require('../../../src/server/app').api.app
  , secret = require('../../../src/secret')


describe("POST /api/v1/drops/:name", function () {
  var code = null;

  beforeEach(function() {
    code = "module.exports = "+function() {
      return {
        install: function(cb) {
          cb(null, { hello: 'world' })
        }
      }
    }.toString()
  });

  it("rejects unauthorized", function(done) {
    request(app).post('/api/v1/drops/foo').expect(401).end(done)
  });

  it("creates drop and returns 201 created", function(done) {
    request(app)
    .post('/api/v1/drops/foo')
    .set('X-Auth-Token', secret)
    .set('Content-Type', 'application/javascript')
    .send(code)
    .expect(201)
    .end(function(err, res) {
      if (err) throw err;
      expect(err).to.eq(null)
      done()
    })
  });
})

describe("POST /api/v1/drops/:name/:action", function () {
  it("rejects unauthorized", function(done) {
    request(app).post('/api/v1/drops/foo/install').expect(401).end(done)
  });

  it("performs the action and returns the output", function(done) {
    request(app)
    .post('/api/v1/drops/foo/install')
    .set('X-Auth-Token', secret)
    .send({ namespace: 'myuser' })
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err) throw err;
      expect(err).to.eq(null)
      expect(res.body.hello).to.eq('world')
      done()
    })
  });
})
