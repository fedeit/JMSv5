const path = require('path');
const fs = require('fs');

const express = require('express')
const router = express.Router()

console.log(__dirname);

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  console.log('IP: ', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
  next()
})

router.get('/', function (req, res) {
    res.render(path.join(__dirname+'/../views/articles.ejs'));
})

module.exports = router
