const url = require('url');
const methods = require('methods');
const Layer = require("./layer");
const Route = require('./route');

const proto = {}

// 如果一个类返回一个对象，那么会用这个对象作为实例
function Router() {
  const router = (req, res, next) => {
    router.handler(req, res, next);
  };
  router.stack = [];
  router.paramsCallbacks = {};
  Object.setPrototypeOf(router, proto);
  return router;
}

methods.forEach(method => {
  proto[method] = function (path, handlers) {
    if(!Array.isArray(handlers)) {
      handlers = [handlers];
    }
    // 1.给每个路由增加route属性
    const route = new Route(); // 这里route中要存储用户的真实回调
    // 每次掉用路由的时候会产生一层
    const layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route; // 路由中每层都有一个route属性
    // 3.最终将这一层放到路由系统中
    this.stack.push(layer);
    route[method](path, handlers);
    // console.log(layer, layer.route.stack); // 这里是路由系统中的每一层
  };
});

proto.handle_params = function (req, res, layer,done) {
  const paramsCallbacks = this.paramsCallbacks;
  const keys = layer.keys.map(i => i.name);
  if(!keys.length) return done();

  let idx = 0;
  let key;
  let fns;

  let i = 0;
  const processCallback = () => {
    const fn = fns[i++];
    if(typeof fn === 'function') {
      fn(req, res, processCallback, layer.params[key], key);
    } else {
      i = 0;
      next(); // 参数1处理完再处理参数2，以此类推....
    }
  };
  const next = () => {
    if(idx >= keys.length) return done();
    key = keys[idx++];
    fns = paramsCallbacks[key];
    if(fns && fns.length) {
      processCallback();
    } else {
      next();
    }
  }
  next()
}

proto.handler = function (req, res, out) {
  const { pathname } = url.parse(req.url);
  const method = req.method?.toLowerCase();

  let index = 0;
  let removed = '';
  const next = (error) => {
    if (index >= this.stack.length) {
      // return res.end(`Can not get ${pathname}`);
      return out(error);
    }
    const layer = this.stack[index++];

    //! 从上一个next到下一个next 就表示出来了，需要加上中间件路径
    if(removed.length > 0) {
      req.url = removed + req.url;
      removed = '';
    }
    if (error) { // 错误情况处理
      if(!layer.route) { // 如果没有route，那么就是中间件
        if(layer.handler.length === 4) { // 4个参数是错误中间件
          layer.handle_error(error, req, res, next);
        } else { // 是普通中间件
          next(error)
        }
      } else { // 路由
        next(error)
      }
    } else { // 正常情况处理
      const match = layer?.match(pathname);
      //! 顶层只判断请求路径，内层判断请求方法
      if (match) {
        // 匹配路由和中间件
        // 无论是中间件还是路由要求路径都要匹配，路由需要配方法
        if (!layer.route && layer.isUseMiddleware) {
          if (layer.handler.length === 4) { // 4个参数是错误中间件
            next(); // 正常情况下不处理错误中间件
          } else { // 是普通中间件
            //! 进入中间件的时候，需要删除中间件的路径
            removed = layer.path === '/' ? '' : layer.path;
            req.url = req.url.slice(removed.length) || '/';
            layer.handle_request(req, res, next);
          }
        } else {
          if (layer.route?.methods?.[method]) {
            // 将匹配到的路由参数挂载到req上
            req.params = req.params || {};
            Object.assign(req.params, layer.params);

            // 处理query参数
            req.query = req.query || {};
            const searchParams = new URL(req.url, 'http://localhost').searchParams;
            for (const [key, value] of searchParams.entries()) {
              req.query[key] = value;
            }
            // 处理param完毕后，在处理真正的响应
            this.handle_params(req, res, layer, () => {
              //! 顶层这里调用的 handler 其实就是 dispatch 函数
              layer.handle_request(req, res, next);
            });
          } else {
            next();
          }
        }
      } else {
        next();
      }
    }
  }
  next();
  // res.statusCode = 404;
  // res.end('404 Not Found');
}

proto.use = function (path, handlers) {
  if (typeof path === 'function') { // 如果是函数，那么就是中间件
    handlers.unshift(path); // 将函数放到数组的第一个
    path = '/';
  }
  handlers.forEach(handler => { // 遍历用户传入的中间件
    const layer = new Layer(path, handler); // 创建一个layer
    layer.isUseMiddleware = true; // 标识这个layer是一个中间件
    this.stack.push(layer); // 将layer放到路由系统中
  });
}

proto.param = function(key, cb) {
  if (typeof cb !== 'function') {
    throw new TypeError('param() requires a callback function');
  }
  if(this.paramsCallbacks[key]) {
    this.paramsCallbacks[key].push(cb);
  } else {
    this.paramsCallbacks[key] = [cb];
  }
}

module.exports = Router;