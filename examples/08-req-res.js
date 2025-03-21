// const express = require('express');
const express = require('../lib/express');

const app = express();
let port = 5500;

app.get('/user', (req, res) => {
  const result = {
    method: 'GET',
    path: req.path,
    code: 200,
    msg: 'success',
    data: 'this is get /user!!'
  };
  // res.end(result); // error
  res.send(result);
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
