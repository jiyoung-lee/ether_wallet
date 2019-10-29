const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'INDEX' });
});

router.get('/err', function (req, res) {
  let title = 'Error'
  return res.render('err', { title })
})
module.exports = router;
