const url = require('url')
const Layer = require('./layer')
const Route = require('./route')
const methods = require('methods')

function Router (){
  this.stack = [] // 维护所有的路由
}

Router.prototype.route = function(path) {
  const route = new Route() // 产生route
  // 产生 layer 让 layer和route进行关联
  const layer = new Layer(path, route.dispatch.bind(route))
  layer.route = route // 每个路由都具备一个route属性，稍后路径匹配到后会调用route中的每一层
  this.stack.push(layer)
  return route
}

methods.forEach((method) => {
  Router.prototype[method] = function(path, handlers) {
    // 1.用户调用get时需要保存成一个layer放到栈中
    // 2.产生一个Route实例和当前的layer创造关系
    // 3.要将route的dispatch方法存放到layer上
    const route = this.route(path)
    // 用户调用get方法时，传入的handler就不止一个了
    route[method](handlers) // 让route记住用户传入的handler并且标记这个handler是什么方法
  }
})

Router.prototype.use = function(path, ...handlers) {
 if(typeof path == 'function') {
   handlers.unshift(path)
   path = '/'
 }
 for (let i = 0; i < handlers.length; i++) {
   const layer = new Layer(path, handlers[i])
   // 中间件不需要route属性
   layer.route = undefined
   this.stack.push(layer)
   
 }
}

Router.prototype.handle = function(req, res, out) {
  // 1.需要取出路由系统中Router存放的layer依次执行
  const { pathname } = url.parse(req.url)
  let idx = 0
  const next = (error) => {
    // 遍历完后还没有找到，那就直接走出路由系统即可
    if(idx >= this.stack.length) return out()
    const layer = this.stack[idx++]
    if(error) {
      // 统一错误处理
      if(!layer.route) {
        layer.handle_error(error, req, res, next)
      } else {
        // 路由则跳过，继续携带错误向下执行
        next(error)
      }
      return
    }
    // 需要查看layer上的path和当前请求的路径是否一致，如果一致调用dispatch方法
    if(layer.match(pathname)) {
      // 中间件没有方法可以匹配
      if(!layer.route) { // 中间件
        if(layer.handler.length !== 4) {
          layer.handle_request(req, res, next)
        } else {
          next()
        }
      } else {
        // 路径匹配到了，需要让layer上对应的dispatch执行
        if(layer.route.methods[req.method.toLowerCase()]) { // 加速匹配
          layer.handle_request(req, res, next)
        } else {
          next()
        }
      }
    } else {
      next()
    }
  }
  next()
}

module.exports = Router