const App = require('./application');

// 创建应用
function createApplication() {
  const app = new App();
  return app;
}

module.exports = createApplication