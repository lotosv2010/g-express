const express = require('../g-express')
const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.end('this is page!!')
})
app.get('/add', (req, res) => {
  res.end('this is add action!!')
})
// app.post('/', (req, res) => {
//   res.end('Got a POST request')
// })
// app.put('/user', (req, res) => {
//   res.end('Got a PUT request at /user')
// })
// app.delete('/user', (req, res) => {
//   res.end('Got a DELETE request at /user')
// })
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})