const Application = require('./application')
// 创建应用
function createApplication() {
  return new Application()
}

createApplication.Router = require('./router')

module.exports = createApplication