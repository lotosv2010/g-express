// const express = require('express');
const express = require('../lib/express');

const app = express();
let port = 5500;


app.param('userId', (req, res, next, value, key) => {
  console.log(req.params[key], value, key);
  if(value == 1) {
    req.params[key] *= 2;
  }
  next();
})

app.param('userId', (req, res, next, value, key) => {
  console.log(req.params[key], value, key); // 这里 value 是一个死值，永远是初始值
  if(req.params[key] == 2) {
    req.params[key] += 10;
  }
  next();
})

app.param('bookId', (req, res, next, value, key) => {
  req.params[key] *= 5;
  next();
})

app.get('/user/:userId/book/:bookId', (req, res) => {
  console.log(req.params, req.query)
  const { userId, bookId } = req.params;
  res.end(`get /users/${userId}/books/${bookId}`);
});

app.get('/user', (req, res) => {
  res.end('get /users');
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
