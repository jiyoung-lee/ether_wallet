const express = require('express');
const Web3 = require('web3');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const CryptoJS = require('crypto-js');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io'));

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

router.get('/', function (req, res) {
    let title = "Create Account"
    return res.render('create', { title });
});

router.post('/create_process', function (req, res) {
    let account = web3.eth.accounts.create();
    let {id, password} = req.body;
    let password1 = bcrypt.hashSync(password)
    let privatekey1 = CryptoJS.AES.encrypt(account.privateKey,'123').toString();
    let sql = 'insert into wallet_info(userid, password, public_key, private_key) values(?, ?, ?, ?)';
    db.query(sql, [id, password1, account.address, privatekey1], function (err, result) {
        if(err){
            return res.redirect('/err');
        } else {
        return res.redirect('/');
        }
    })
});

module.exports = router;