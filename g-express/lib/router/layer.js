const pathToRegexp = require("path-to-regexp");

function Layer(path, handler) {
  this.path = path;
  this.handler = handler;
  this.keys = [];
  this.regexp = pathToRegexp(path, this.keys, {});
  this.params = {};
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

module.exports = Layer;