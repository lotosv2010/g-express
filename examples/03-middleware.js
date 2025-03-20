// const express = require('express');
const express = require('../lib/express');

const app = express();
let port = 5500;

// 中间件可以扩展功能，可以写一写公共逻辑，可以决定是否向下执行
// 自定的中间件一般需要在路由的前面，因为要是在访问路由之前做执行操作
// 路径不写默认就是 / 表示任何路径都可以匹配到(匹配方式只要路径开头一致即可)

// 1)如果以中间件路径开头则可以匹配
// 2)如果相等可以匹配
// 3)如果没有路径 是/也表示可以匹配

app.use((req, res, next) => {
  console.log('middleware1');
  next();
}, (req, res, next) => {
  console.log('middleware2');
  next();
});

app.use('/user', (req, res, next) => {
  console.log('middleware3');
  next();
});

app.get('/user', (req, res, next) => {
  res.end('this is get /user!!');
});

app.post('/user', (req, res, next) => {
  res.writeHead(200, {
    'Content-Type': 'application/json;charset=utf-8'
  });
  const data = JSON.stringify({
    data: 'this is post /user',
    code: 0
  });
  res.end(data);
});

app.post('/home', (req, res, next) => {
  res.writeHead(200, {
    'Content-Type': 'application/json;charset=utf-8'
  });
  res.end(JSON.stringify({
    data: 'this is post /home',
    code: 0
  }));
});


const server = app.listen(port, (error) => {
  console.log(`Example app listening on port ${port}!`);
});

// 监听错误
server.on('error', (error) => {
  // 端口被占用
  if (error.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(++port);
    }, 1000);
  }
})
