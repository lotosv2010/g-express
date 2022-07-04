const url = require('url');
const methods = require('methods');
const Layer = require("./layer");

function Router () {
  this.stack = [];
}

methods.forEach(method => {
  Router.prototype[method] = function(path, handler) {
    const layer = new Layer(path, handler);
    layer.method = method;
    this.stack.push(layer);
  };
});

Router.prototype.handler = function (req, res) {
  const { pathname } = url.parse(req.url);
  const method = req.method?.toLowerCase();
  const route = this.stack.find(layer => {
    const match = layer.match(pathname);
    if(match) {
      req.params = req.params || {};
      Object.assign(req.params, layer.params);
    }
    return match && layer.method === method;
  });
  if(route) {
    return route.handler(req, res);
  }
  res.statusCode = 404;
  res.end('404 Not Found');
}

module.exports = Router;