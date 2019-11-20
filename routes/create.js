const express = require('express');
const Web3 = require('web3');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const CryptoJS = require('crypto-js');
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io'));

const db = require('../db/db_info')
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

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
    db.mysql.query(sql, [id, password1, account.address, privatekey1], function (err, result) {
        if(err){
            return res.status(200).json({});
        } else {
            return res.status(202).json({});
        }
    })
});

module.exports = router;