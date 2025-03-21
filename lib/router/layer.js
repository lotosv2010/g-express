const pathToRegexp = require("path-to-regexp");

// express 模型里面有两个地方使用这个layer
// Router.stack =[] path用户写的路径 route.dispatch
// Route.stack=[] 路径没有意义 用户写的真实回调，里层的layer还需要写方法

function Layer(path, handler) {
  this.path = path;
  this.handler = handler;
  this.keys = [];
  this.regexp = pathToRegexp(path, this.keys, {
    strict: true
  });
  this.params = {};
  this.query = {};
}

Layer.prototype.match = function (pathname) {
  const match = this.regexp.exec(pathname);
  if(match) {
    this.keys.forEach((key, index) => {
      this.params[key.name] = match[index + 1];
    });
    return true;
  }

  //! 匹配use中间件的路径处理
  if(this.isUseMiddleware) {
    if(this.path === '/') {
      return true;
    }
    if(pathname.startsWith(`${this.path}/`)) {
      return true;
    }
  }
  return false;
}

Layer.prototype.handle_request = function (req, res, next) {
  try {
    this.handler(req, res, next);
  } catch (error) {
    next(error);
  }
}

Layer.prototype.handle_error = function (err, req, res, next) {
  this.handler(err, req, res, next);
}

module.exports = Layer;