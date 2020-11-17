var express = require('express')
var router = express.Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', function (req, res) {
  res.send('Dating Universe home page')
})
// define the route
router.get('/createAccount', function (req, res) {
  res.send('Create Account')
})
router.get('/profile', function (req, res) {
  res.send('Profile')
})
module.exports = router