const methods = require('methods');
const Layer = require('./layer');

function Route () {
  this.stack = [];
  this.methods = {}; // 存储当前路由支持的方法
}

/**
 * 遍历执行当前路由对象中的所有处理函数
 */
Route.prototype.dispatch = function(req, res, out) {
  //! 遍历内层的 stack
  let index = 0;
  const method = req.method.toLowerCase();
  const next = () => {
    if(index >= this.stack.length) return out();
    const layer = this.stack[index++];
    // console.log('layer.method', layer.method, method, req.url);
    if(layer.method === method) {
      layer.handler(req, res, next);
    } else {
      next();
    }
  }
  next();
}

methods.forEach(method => {
  Route.prototype[method] = function (path, handlers) {
    handlers.forEach(handler => {
      const layer = new Layer(path, handler); // 这里的layer 中不需要路径 path
      layer.method = method;
      this.methods[method] = true; // 标记当前路由支持的方法
      this.stack.push(layer);
    });
  }
});

module.exports = Route;