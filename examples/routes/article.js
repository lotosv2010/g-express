// const express = require('express');
const express = require('../../lib/express');
const router = express.Router();

router.post('/add', (req, res) => {
  res.end('post /article/add');
})

router.post('/remove', (req, res) => {
  res.end('post /article/remove');
})

module.exports = router;