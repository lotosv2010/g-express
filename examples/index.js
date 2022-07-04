const express = require('../g-express');

const app = express();
const port = 4000;

// 1.路径位 / 表示任何路径都能匹配到
// 2.如果以这个路径(匹配开头一段路径)也可以匹配到
// 3.和路由的路径完全一样，也可以匹配到

// 中间件不具备方法(针对路径拦截)，也不具备传递多个参数push({ path, method: 'get', handler });
// 中间件肯定的基于路径来做(扩展性，扩展方法)
app.use((req, res, next) => {
  console.log('use');
  next();
});

app.get('/', (req, res, next) => {
  console.log(1);
  next();
}, (req, res, next) => {
  console.log(2);
  next();
}, (req, res, next) => {
  console.log(3);
  res.end('this is page!!');
});

app.get('/home', (req, res, next) => {
  console.log(1);
  next();
});

app.get('/home', (req, res, next) => {
  console.log(2);
  next();
});

app.get('/home', (req, res, next) => {
  console.log(3);
  res.end('this is home!!');;
});

app.get('/ab?cd', (req, res) => {
  res.end('get /ab?cd');
});

app.post('/ab*cd', (req, res) => {
  res.end('post /ab*cd');
});

app.get('/users/:userId/books/:bookId', (req, res) => {
  console.log(req.params)
  res.end('get /users/:userId/books/:bookId');
});

app.get('/list', (req, res) => {
  res.end('get /list');
});

app.post('/list', (req, res) => {
  res.end('post /list');
});

app.put('/list', (req, res) => {
  res.end('put /list');
});

app.patch('/list', (req, res) => {
  res.end('patch /list');
});

app.delete('/list', (req, res) => {
  res.end('delete /list');
});

// console.log(app._router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});