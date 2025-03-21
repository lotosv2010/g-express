// const express = require('express');
const express = require('../lib/express');

const app = express();
let port = 5500;

app.get('/user', (req, res) => {
  console.log(req.query)
  res.end('/users?userId=1&bookId=2');
});

app.get('/user/:userId/book/:bookId', (req, res) => {
  console.log(req.params)
  console.log(req.query)
  res.end('get /users/:userId/books/:bookId');
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
