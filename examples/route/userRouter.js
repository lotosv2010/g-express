const express = require('../../g-express')
const router = express.Router()

router.get('/add', (req, res) => {
  res.end('userAdd')
})

router.get('/remove', (req, res) => {
  res.end('userRemove')
})

module.exports = router