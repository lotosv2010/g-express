const http = require('http');
const Router = require('./router');

function App () {
  this._router = new Router();
}

/**
 * 收集路由
 * @param {*} path 
 * @param {*} handler 
 */
App.prototype.get = function(path, handler) {
  this._router.get(path, handler);
};

/**
 * 监听
 * @param  {...any} args 
 */
App.prototype.listen = function(...args) {
  const server = http.createServer((req, res) => {
    this._router.handler(req, res);
  });
  server.listen(...args);
};

module.exports = App;