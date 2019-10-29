const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const db = require('../DB/db')
const session = require('express-session');
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);

router.use(bodyParser.urlencoded({ extended: false }));

db.connect() //mysql 접속

router.use(session({
    secret: '12312dajfj23rj2po4$#%@#',
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

/*router.post('/create_process', function (req, res) {
    let { id, password } = req.body;
    var sql = 'select * from wallet_info where id=?'
    web3.eth.accounts.create();

    db.query(sql, [id], function (err, results) {
        if (err) {
            console.log('there is no user');
        }
        if (!results[0]) {
            return res.render('/error');
        }

    })
})*/

router.post('/login_process', function (req, res) {
    let { id, password } = req.body;
    var sql = 'select * from wallet_info where userid=?'
    db.query(sql, [id], function (err, results) {
        if (err) {
            return res.redirect('/err')
        }
        if (!results.length) {
            return res.redirect('/err')
        }
        else {
            bcrypt.compare(password, results[0].password, function (err, res) {
                if (res === true) {
                    req.session.is_logined = true;
                    req.session.userid = results[0].userid;
                    req.session.password = results[0].password;
                    req.session.public_key = results[0].public_key;
                    req.session.private_key = results[0].private_key;
                    req.session.save(function () {
                        console.log('err')
                    })
                } else {
                    req.session.is_logined = false;
                    return res.redirect('/err')
                }
            })
        }
    })

});


module.exports = router;
