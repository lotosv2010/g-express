const url = require('url');
const methods = require('methods');
const Layer = require("./layer");
const Route = require('./route');

function Router () {
  this.stack = [];
}

methods.forEach(method => {
  Router.prototype[method] = function(path, handlers) {
    const route = new Route();
    const layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    this.stack.push(layer);
    route[method](path, handlers);
  };
});

Router.prototype.handler = function (req, res) {
  const { pathname } = url.parse(req.url);
  const method = req.method?.toLowerCase();

  let index = 0;
  const next = () => {
    if(index >= this.stack.length) {
      res.end(`Can not get ${pathname}`);
    }
    const layer = this.stack[index++];
    const match = layer?.match(pathname);
    if(match) {
      req.params = req.params || {};
      Object.assign(req.params, layer.params);
    }
    //! 顶层只判断请求路径，内层判断请求方法
    if(match) {
      //! 顶层这里调用的 handler 其实就是 dispatch 函数
      return layer.handler(req, res, next);
    }
    next();
  }
  next();
  // res.statusCode = 404;
  // res.end('404 Not Found');
}

module.exports = Router;