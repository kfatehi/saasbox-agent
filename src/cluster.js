var logger = require('./logger')

module.exports = function (work) {
  if (process.env.NODE_ENV !== 'production') return work();

  var cluster = require('cluster')

  if(cluster.isMaster){
    var cpuCount = require('os').cpus().length;

    for (var i = 0; i < cpuCount; i += 1) {
      cluster.fork();
    }

    cluster.on('online', function(worker) {
      logger.info('worker '+worker.process.pid +' online')
    });

    cluster.on('exit', function(worker, code, signal) {
      logger.error('worker ' + worker.process.pid + ' died', code, signal);
      cluster.fork()
    });
  } else {
    work()
  }
}

