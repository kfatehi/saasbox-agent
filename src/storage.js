if (!process.env.STORAGE_PATH) throw new Error('You must set STORAGE_PATH')
var LocalStorage = require('node-localstorage').LocalStorage;
module.exports = new LocalStorage(process.env.STORAGE_PATH);
