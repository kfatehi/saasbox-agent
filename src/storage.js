var path = require('path')
var logger = require('winston')
var storage_path = process.env.STORAGE_PATH
if (!storage_path) {
  storage_path = path.join(__dirname, '..', 'data')
  logger.warn('no STORAGE_PATH set, defaulted to '+storage_path); 
}
var LocalStorage = require('node-localstorage').LocalStorage;

var mkdirp = require('mkdirp')

mkdirp.sync(storage_path);

module.exports = {
  localStorage: new LocalStorage(path.join(storage_path, 'localStorage')),
  root: storage_path
}
