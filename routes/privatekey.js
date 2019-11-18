const express = require('express');
const Web3 = require('web3');
const router = express.Router();
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io'));
const bcrypt = require('bcrypt-nodejs');
const CryptoJS = require('crypto-js');

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
  router.get('/', function (req, res, next) {
    let { is_logined } = req.session;
    if (!is_logined) {
        return res.redirect('/')
    }
    return res.render('privatekey', { title: 'privatekey' });
})

router.post('/account', function (req, res) {
    let { id, password } = req.body;
    let { userid, private_key } = req.session;
    let sessPassword = req.session.password;
    if (userid !== id) {
        res.status(200).json({})
    } else {
        bcrypt.compare(password, sessPassword, (err, value) => {
            if( value !== true ) {
                res.status(200).json({})
            }
            if (value === true) {
                let decrypt = CryptoJS.AES.decrypt(private_key, '123')
                private_key = decrypt.toString(CryptoJS.enc.Utf8)
                console.log(private_key)
                res.status(202).json({ 'privatekey': private_key.substring(2) })
            }
        })
    }

})


module.exports = router;
