const express = require('../../g-express')
const router = express.Router()

router.get('/add', (req, res) => {
  res.end('roleAdd')
})

router.get('/remove', (req, res) => {
  res.end('roleRemove')
})

module.exports = router