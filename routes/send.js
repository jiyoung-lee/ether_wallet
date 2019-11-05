const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('send', { title: 'SEND' });
});

router.post('/send_process', function(req, res, next) {

  });

module.exports = router;
