const url = require('url')
function Router (){
  this.stack = [] // 维护所有的路由
}

Router.prototype.get = function(path, handler) {
  this.stack.push({
    path,
    method: 'get',
    handler
  })
}

Router.prototype.handle = function(req, res, done) {
  const { pathname } = url.parse(req.url)
    const requestMethod = req.method.toLowerCase()
    for (let i = 0; i < this.stack.length; i++) {
      const { path, method, handler } = this.stack[i]
      if(path === pathname && method === requestMethod) {
        return handler(req, res)
      }
    }
    return done()
}

module.exports = Router