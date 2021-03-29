const Layer = require('./layer')
const methods = require('methods')

function Route() {
  this.stack = []
  this.methods = {} // 用来标识内部存过哪些方法
}
Route.prototype.dispatch = function(req, res, out) {
  let idx = 0
  const next = () => {
    if(idx >= this.stack.length) return out()
    const layer = this.stack[idx++]
    console.log(layer.method)
    if(layer.method === req.method.toLowerCase()) {
      layer.handle_request(req, res, next)
    } else {
      next()
    }
  }
  next()
}

methods.forEach((method) => {
  Route.prototype[method] = function(handlers) {
    if(!Array.isArray(handlers)) {
      handlers = [handlers]
    }
    handlers.forEach(handler => {
      const layer = new Layer('', handler) // 路径没有意义
      layer.method = method // 标记layer上是什么方法
      this.methods[method] = true
      this.stack.push(layer)
    });
  }
})

module.exports = Route