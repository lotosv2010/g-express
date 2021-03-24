const Layer = require('./layer')
function Route() {
  this.stack = []
}
Route.prototype.dispatch = function(req, res, out) {
  let idx = 0
  const next = () => {
    if(idx >= this.stack.length) return out()
    const layer = this.stack[idx++]
    if(layer.method === req.method.toLowerCase()) {
      layer.handler(req, res, next)
    } else {
      next()
    }
  }
  next()
}
Route.prototype.get = function(handlers) {
  handlers.forEach(handler => {
    const layer = new Layer('', handler) // 路径没有意义
    layer.method = 'get' // 标记layer上是什么方法
    this.stack.push(layer)
  });
}
module.exports = Route