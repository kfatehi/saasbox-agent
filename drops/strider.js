module.exports = function(scope, argv, ydm) {
  var _ = require('lodash')
    , Mongo = ydm.drops['mongo'](argv, ydm)
    , mongo = new Mongo()

  return {
    requireAlways: {
      '--namespace': "uses links, therefore a namespace is required",
    },
    install: function (done) {
      mongo.install(function (err, mongoInfo) {
        scope.applyConfig({
          create: {
            Image: "quay.io/keyvanfatehi/strider:1.5.0",
            Env: _.assign({
              /* https://github.com/Strider-CD/strider#configuring */
              SERVER_NAME: "https://"+argv.fqdn,
              DB_URI: 'mongodb://'+mongoInfo.ip_address+':27017/strider-foss',
              //SMTP_FROM: 'Strider-CD <no-reply@'+argv.fqdn+'>'
            }, argv.config || {})
          },
          start: {
            Binds: scope.managedVolumes({
              home: '/home/strider'
            }),
            Link: scope.managedLinks({
              mongo: mongo
            })
          }
        }, function (err, wait) {
          if (err) return done(err);
          if (wait) return done(null, wait);
          scope.inspectContainer(function (err, data) {
            if (err) return done(err);
            var ip = data.NetworkSettings.IPAddress;
            var info = {
              running: data.State.Running,
              ip_address: ip,
              ports: data.NetworkSettings.Ports,
              app: {
                url: "http://"+ip+":3000",
                email: "test@example.com",
                password: "dontlook"
              }
            }
            // we need to create a user now
          });
        });
      })
    }
  }
}
