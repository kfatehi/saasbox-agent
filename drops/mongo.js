module.exports = function(scope, argv, ydm) {
  return {
    install: function (done) {
      scope.applyConfig({
        create: {
          Image: "quay.io/keyvanfatehi/mongo:2.7.7"
        },
        start: {
          PublishAllPorts: !!argv.publish,
          Binds: scope.managedVolumes({
            data: '/data/db'
          })
        }
      }, function (err, stream) {
        if (err) return done(err);
        if (stream) return done(null, stream, stream);
        scope.tailUntilMatch(/waiting for connections on port 27017/, function () {
          scope.inspectContainer(function (err, data) {
            var ip = data.NetworkSettings.IPAddress;
            done(null, {
              ip_address: ip,
              ports: data.NetworkSettings.Ports
            })
          })
        });
      });
    }
  }
}
