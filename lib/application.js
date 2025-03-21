const http = require('http');
const methods = require('methods');
const Router = require('./router');
const initMiddleware = require('./middleware/init');

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
    this.use(initMiddleware()); // 内置中间件
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
    this._router.handler(req, res, (error) => {
      if(error) {
        console.error(error);
        return res.end(error.message);
      }
      return res.end(`Can not ${req.method} ${req.path}`);
    });
  });
  server.listen(...args);
  return server;
};

App.prototype.param = function(key, cb) {
  this.lazy_route();
  this._router.param(key, cb);
};

module.exports = App;