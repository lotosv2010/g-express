// const express = require('express');
const express = require('../../lib/express');
const router = express.Router();

router.post('/add', (req, res) => {
  res.end('post /user/add');
})

router.post('/remove', (req, res) => {
  res.end('post /user/remove');
})

module.exports = router;