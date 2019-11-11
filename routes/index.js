const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const db = require('../db/db_info')
const session = require('express-session');
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);

router.use(bodyParser.urlencoded({ extended: false }));

router.use(session({
    secret: 'asadlfkj!@#',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '111111',
        database: 'ethwallet'
    })
}));

/* GET home page. */
router.get('/', function (req, res, next) {
  return res.render('index', { title: 'Login' });
});

router.post('/login_process', function (req, res) {
  let { id, password } = req.body;

  var sql = 'select * from wallet_info where userid=?'
  db.query(sql, [id], function (err, result) {
      bcrypt.compare(password, result[0].password, function (err, data) {
          if (data === true) {
              req.session.is_logined = true;
              req.session.userid = result[0].userid;
              req.session.password = result[0].password;
              req.session.private_key = result[0].private_key;
              req.session.public_key = result[0].public_key;
              req.session.save(function () {
                  //return res.redirect('/main')
                  return res.status(202).json({})
              });
          } else {
              //return res.redirect('/err')
              return res.status(200).json({});
          }
      })

  });
});

module.exports = router;
