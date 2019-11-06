const express = require('express');
const Web3 = require('web3');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
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

router.post('/login_process', function (req, res) {
    let { id, password } = req.body;
    var sql = 'select * from wallet_info where userid=?'
    db.query(sql, [id], function (err, result) {
        if (result.length && result[0].password === password) {
            req.session.is_logined = true;
            req.session.userid = result[0].userid;
            req.session.password = result[0].password;
            req.session.private_key = result[0].private_key;
            req.session.public_key = result[0].public_key;
            req.session.save(function () {
                return res.redirect('/main');
            });
        } 
        else {
            return res.redirect('/err');
        }
    });
});

router.get('/', async function (req, res) {
    let title = "Main"
    let { userid, public_key, is_logined } = req.session;
    if(!is_logined){
        return res.redirect('/')
    }
    await web3.eth.getBalance(public_key, function (err, wei) {
        balance = web3.utils.fromWei(wei, 'ether')
    });

    var sql = 'select txhash from txhash where userid = ?'
    db.query(sql, [userid], function(err, result) {
        if(err) {
            return res.render('/err')
        }
        //let TxHashList = result[0].txhash;
        let txhash_list = [];
        for(i=0; i < result.length; i++){
            txhash_list.push(result[i].txhash)
        }
        return res.render('main', { title, userid, public_key, balance, txhash_list});
    })
});

router.get('/session_destroy', function (req, res) {    
    req.session.destroy();  // 세션 삭제
    res.clearCookie('sid'); // 세션 쿠키 삭제
    res.redirect('/');
})

module.exports = router;
