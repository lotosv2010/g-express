const express = require('../g-express')
const app = express()
const port = 4000

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
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})