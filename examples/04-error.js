// const express = require('express');
const express = require('../lib/express');

const app = express();
let port = 5500;

app.use((req, res, next) => {
  // console.log(b)
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
  console.log(a)
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

app.use((error, req, res, next) => {
  res.statusCode = 500;
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  res.end(JSON.stringify({
    message: error.message,
    code: error.code,
    name: error.name
  }));
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
