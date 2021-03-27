const express = require('../g-express')
// const express = require('express')
const app = express()
const port = 4000

// 1.路径位 / 表示任何路径都能匹配到
// 2.如果以这个路径(匹配开头一段路径)也可以匹配到
// 3.和路由的路径完全一样，也可以匹配到

// 中间件不具备方法(针对路径拦截)，也不具备传递多个参数
// 中间件肯定的基于路径来做(扩展性，扩展方法)
app.use((req, res, next) => {
  console.log(1);
  next()
})

app.use((req, res, next) => {
  console.log(2);
  next()
})

app.use((req, res, next) => {
  console.log(3);
  next()
})

app.use('/', (req, res, next) => {
  next('错误')
  res.end('ok')
})

app.delete('/', (req, res) => {
  res.end('this is page!!')
})
app.put('/', (req, res) => {
  res.end('this is page!!')
})
app.post('/', (req, res) => {
  res.end('this is page!!')
})
app.get('/list', (req, res) => {
  res.end('this is list action!!')
})
app.post('/add', (req, res) => {
  res.end('Got a add request')
})
app.put('/user', (req, res) => {
  res.end('Got a PUT request at /user')
})
app.delete('/user', (req, res) => {
  res.end('Got a DELETE request at /user')
})

app.use((error, req, res, next) => {
  // res.header("Content-Type", "application/json; charset=utf-8")
  res.end('error' + error)
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})