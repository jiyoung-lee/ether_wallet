const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const db = require('../db/db_info')
const session = require('express-session');
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);

router.use(bodyParser.urlencoded({ extended: false }));

db.connect() //mysql 접속

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

router.get('/create', function (req, res) {
    let title = "Create Account"
    return res.render('create', { title });
});

router.post('/create_process', function (req, res) {

});

router.get('/main', function (req, res) {
    let title = "Main"
    return res.render('main', { title });
});

router.post('/login_process', function (req, res) {
    let { id, password } = req.body;
    var sql = 'select * from wallet_info where userid=?'
    db.query(sql, [id], function (err, result) {

        if (result[0].password === password) {
            req.session.is_logined = true;
            req.session.userid = result[0].userid;
            req.session.password = result[0].password;
            req.session.save(function () {
                return res.redirect('/topic/main');
            });
        } else if (!result.length) {
            return res.redirect('/err');
        }
        else {
            return res.redirect('/err');
        }
    });
});


module.exports = router;
