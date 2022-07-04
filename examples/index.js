const express = require('../g-express');

const app = express();
const port = 4000;

// 1.路径位 / 表示任何路径都能匹配到
// 2.如果以这个路径(匹配开头一段路径)也可以匹配到
// 3.和路由的路径完全一样，也可以匹配到

// 中间件不具备方法(针对路径拦截)，也不具备传递多个参数push({ path, method: 'get', handler });
// 中间件肯定的基于路径来做(扩展性，扩展方法)

app.get('/', (req, res) => {
  res.end('this is page!!');
})

app.get('/list', (req, res) => {
  res.end('this is list action!!');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})