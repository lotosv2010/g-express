// const express = require('express');
const express = require('../lib/express');

const app = express();
let port = 5500;

app.get('/', (req, res) => {
  res.send('Hello World!');
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
