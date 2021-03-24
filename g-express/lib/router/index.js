const url = require('url')
const Layer = require('./layer')
const Route = require('./route')
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

Router.prototype.get = function(path, handlers) {
  // 1.用户调用get时需要保存成一个layer放到栈中
  // 2.产生一个Route实例和当前的layer创造关系
  // 3.要将route的dispatch方法存放到layer上
  const route = this.route(path)
  // 用户调用get方法时，传入的handler就不止一个了
  route.get(handlers) // 让route记住用户传入的handler并且标记这个handler是什么方法
}

Router.prototype.handle = function(req, res, out) {
  // 1.需要取出路由系统中Router存放的layer依次执行
  const { pathname } = url.parse(req.url)
  let idx = 0
  const next = () => {
    // 遍历完后还没有找到，那就直接走出路由系统即可
    if(idx >= this.stack.length) return out()
    const layer = this.stack[idx++]
    // 需要查看layer上的path和当前请求的路径是否一致，如果一致调用dispatch方法
    if(layer.path === pathname) {
      // 路径匹配到了，需要让layer上对应的dispatch执行
      layer.handler(req, res, next)
    } else {
      next()
    }
  }
  next()
}

module.exports = Router