const http = require('http')
const methods = require('methods')
const Router = require('./router/index')
function Application() {
  // 路由的懒加载
  // this._router = new Router()
}

// 调用此方法才开始创建路由，不是创建应用时直接装载路由
Application.prototype.lazy_route = function() {
  if(!this._router) {
    this._router = new Router()
  }
}

// 批量生产方法
methods.forEach((method) => {
  Application.prototype[method] = function (path, ...handlers) {
    this.lazy_route()
    this._router[method](path, handlers)
  }
})

Application.prototype.use = function() {
  this.lazy_route()
  this._router.use(...arguments)
}

Application.prototype.listen = function() {
  const server = http.createServer((req, res) => {
    function done() { // 不属于路由层
      res.end(`Cannot g-express ${req.method} ${req.url}`)
    }
    this.lazy_route()
    this._router.handle(req, res, done)
  })
  server.listen(...arguments)
}

module.exports = Application