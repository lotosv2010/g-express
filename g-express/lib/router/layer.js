function Layer(path, handler) {
  this.path = path
  this.handler = handler
}
Layer.prototype.match = function(pathname) {
  // 这里可以扩展
  if(this.path === pathname) {
    return true
  }
  if(!this.route) { // 中间件
    if(this.path == '/') {
      return true
    }
    // 中间件的匹配规则
    return pathname.startsWith(this.path + '/')
  }
}
Layer.prototype.handle_request = function(req, res, next) {
  this.handler(req, res, next)
}
Layer.prototype.handle_error = function(error, req, res, next) {
  if(this.handler.length == 4) {
    return this.handler(error, req, res, next) // 调用错误处理中间件
  }
  next(error) // 普通的中间件
}
module.exports = Layer