var path = require('path')
var logger = require('./logger')
var storage_path = process.env.STORAGE_PATH
if (!storage_path) {
  storage_path = path.join(__dirname, '..', 'data')
  throw new Error('no STORAGE_PATH set')
}
var LocalStorage = require('node-localstorage').LocalStorage;

var mkdirp = require('mkdirp')

mkdirp.sync(storage_path);

module.exports = {
  localStorage: new LocalStorage(path.join(storage_path, 'localStorage')),
  root: storage_path
}
