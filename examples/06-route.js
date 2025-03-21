// const express = require('express');
const express = require('../lib/express');
const user = require('./routes/user');
const article = require('./routes/article');

const app = express();
let port = 5500;

// 多级路由
app.use('/user', user);

app.use('/article', article);


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
