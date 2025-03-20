const http = require('http');
const Router = require('./router');
const methods = require('methods');

function App () {
  // this._router = new Router();
}

/**
 * 收集路由
 */
methods.forEach(method => {
  // 这里对应路由中的 get post put delete 等方法
  App.prototype[method] = function(path, ...handlers) {
    this.lazy_route();
    this._router[method](path, handlers);
  };
});

App.prototype.lazy_route = function() {
  // 懒加载路由
  if(!this._router) {
    this._router = new Router();
  }
}

// 中间件交给路由处理
App.prototype.use = function(path, ...handlers) {
  this.lazy_route();
  this._router.use(path, handlers);
}

/**
 * 监听
 * @param  {...any} args 
 */
App.prototype.listen = function(...args) {
  this.lazy_route();
  const server = http.createServer((req, res) => {
    this._router.handler(req, res);
  });
  server.listen(...args);
  return server;
};

App.prototype.on = function(event, listener) {

};

module.exports = App;