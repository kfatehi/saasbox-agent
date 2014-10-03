module.exports = function(scope, argv) {
  return {
    install: function (done) {
      scope.applyConfig({
        create: {
          Image: "quay.io/keyvanfatehi/strider:1.5.0",
          Env: {
            /* https://github.com/Strider-CD/strider#configuring */
            SERVER_NAME: "https://"+argv.fqdn,
            PLUGIN_GITHUB_APP_ID: argv.config.PLUGIN_GITHUB_APP_ID,
            PLUGIN_GITHUB_SECRET: argv.config.PLUGIN_GITHUB_SECRET,
            SMTP_HOST: argv.config.SMTP_HOST,
            SMTP_USER: argv.config.SMTP_USER,
            SMTP_PASS: argv.config.SMTP_PASS,
            SMTP_FROM: argv.config.SMTP_FROM
            //SMTP_FROM: 'Strider-CD <no-reply@'+argv.fqdn+'>'
          }
        },
        start: {
          Binds: scope.managedVolumes({
            home: '/home/strider'
          }),
        }
      }, function (err, wait, data) {
        if (err) throw err;
        if (wait) return done(null, wait);
        scope.inspectContainer(function (err, data) {
          var ip = data.NetworkSettings.IPAddress;
          done(err, {
            running: data.State.Running,
            ip_address: ip,
            ports: data.NetworkSettings.Ports,
            app: {
              url: "http://"+ip+":3000",
              email: "test@example.com",
              password: "dontlook"
            },
            ssh: {
              port: 22,
              username: "strider",
              password: "str!der",
              notes: "Root access is prohibited by default through ssh. To get root access login as strider and su to root."
            }
          });
        });
      });
    }
  }
}
