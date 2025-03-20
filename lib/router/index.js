const url = require('url');
const methods = require('methods');
const Layer = require("./layer");
const Route = require('./route');

function Router () {
  this.stack = [];
}

methods.forEach(method => {
  Router.prototype[method] = function(path, handlers) {
    // 1.给每个路由增加route属性
    const route = new Route(); // 这里route中要存储用户的真实回调
    // 每次掉用路由的时候会产生一层
    const layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route; // 路由中每层都有一个route属性
    // 3.最终将这一层放到路由系统中
    this.stack.push(layer);
    route[method](path, handlers);
    // console.log(layer, layer.route.stack); // 这里是路由系统中的每一层
  };
});

Router.prototype.handler = function (req, res) {
  const { pathname } = url.parse(req.url);
  const method = req.method?.toLowerCase();

  let index = 0;
  const next = () => {
    if(index >= this.stack.length) {
      return res.end(`Can not get ${pathname}`);
    }
    const layer = this.stack[index++];
    const match = layer?.match(pathname);
    if(match) {
      req.params = req.params || {};
      Object.assign(req.params, layer.params);
    }
    //! 顶层只判断请求路径，内层判断请求方法
    if(match) {
      if(layer.route?.methods?.[method]) { // 匹配请求方法
        //! 顶层这里调用的 handler 其实就是 dispatch 函数
        return layer.handler(req, res, next);
      }
    }
    next();
  }
  next();
  // res.statusCode = 404;
  // res.end('404 Not Found');
}

Router.prototype.use = function(path, handlers) {
  if(typeof path === 'function') {
    handlers.unshift(path);
    path = '/';
  }
  handlers.forEach(handler => {
    const layer = new Layer(path, handler);
    layer.isUseMiddleware = true;
    this.stack.push(layer);
  });
}

module.exports = Router;