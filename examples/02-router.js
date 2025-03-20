// const express = require('express');
const express = require('../lib/express');

const app = express();
let port = 5500;

app.get('/user', (req, res, next) => {
  console.log(1);
  next(); // 何时掉用next 是由用户控制的
}, (req, res, next) => {
  console.log(2);
  next();
}, (req, res, next) => {
  console.log(3);
  req.user = 100
  next();
});

app.get('/user', (req, res, next) => {
  console.log(4);
  req.user += 100;
  res.end('this is home!! req.user = ' + req.user);
});

app.post('/user', (req, res, next) => {
  console.log(5);
  res.writeHead(200, {
    'Content-Type': 'application/json;charset=utf-8'
  });// 等价express中的下面两句
  // res.set('Content-Type', 'application/json;charset=utf-8')
  // res.set({
  //   'Content-Type': 'application/json;charset=utf-8'
  // });
  const data = JSON.stringify({
    data: 'this is post /user',
    code: 0
  });
  res.end(data);
});

// 监听错误
app.use((error, req, res, next) => {
  console.log('error', error);
  next(error);
})
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
