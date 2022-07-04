const http = require('http');
const Router = require('./router');
const methods = require('methods');

function App () {
  this._router = new Router();
}

/**
 * 收集路由
 */
methods.forEach(method => {
  App.prototype[method] = function(path, handler) {
    this._router[method](path, handler);
  };
});

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