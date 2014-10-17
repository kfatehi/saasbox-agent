module.exports = function(scope, argv, ydm) {
  var _ = require('lodash')
    , Mongo = ydm.drops['mongo'](argv, ydm)
    , mongo = new Mongo()

  return {
    requireAlways: {
      '--namespace': "uses links, therefore a namespace is required",
    },
    install: function (done) {
      var credentials = scope.storage.getItem('credentials')
      if (credentials) {
        credentials = JSON.parse(credentials);
      } else {
        argv.config.GENERATE_ADMIN_USER = true
      }
      getMongoURI(function(err, mongo_uri, stream) {
        if (err) return done(err);
        if (stream) return done(null, stream);
        scope.applyConfig({
          create: {
            Image: "quay.io/keyvanfatehi/strider:1.5.0",
            Env: _.assign({
              FQDN: argv.fqdn || 'example.org',
              SERVER_NAME: "https://"+argv.fqdn,
              DB_URI: mongo_uri,
            }, argv.config || {})
          },
          start: {
            PublishAllPorts: !!argv.publish,
            Binds: scope.managedVolumes({
              home: '/home/strider'
            }),
            Link: scope.managedLinks({
              mongo: mongo
            })
          }
        }, function (err, stream) {
          if (err) return done(err);
          if (stream) return done(null, stream);
          scope.inspectContainer(function (err, data) {
            if (err) return done(err);
            var ip = data.NetworkSettings.IPAddress;
            var info = {
              running: data.State.Running,
              ip_address: ip,
              ports: data.NetworkSettings.Ports,
              app: {
                url: "http://"+ip+":3000"
              }
            }
            if (credentials) {
              info.app.email = credentials.email
              info.app.password = credentials.password
              done(null, info)
            } else {
              var pattern = /Admin User:\s(\S+),\sAdmin Pass: (\S+)\s/;
              scope.tailUntilMatch(pattern, function (err, raw, user, pass) {
                scope.storage.setItem('credentials', JSON.stringify({
                  email: user, password: pass
                }))
                info.app.email = user
                info.app.password = pass
                done(null, info)
              })
            }
          });
        });
      })
    }
  }

  function getMongoURI(done) {
    mongo.install(function (err, info, stream) {
      if (err) return done(err);
      if (stream) return done(null, null, stream);
      done(null, ipToMongoURI(info.ip_address))
    })
  }
}

function ipToMongoURI(ip) {
  return 'mongodb://'+ip+':27017/strider-foss';
}
