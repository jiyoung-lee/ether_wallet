const express = require('express');
const Web3 = require('web3');
const router = express.Router();
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

router.get('/', async function (req, res) {
    let title = "Main"
    let { userid, public_key, is_logined } = req.session;

    if (!is_logined) {
        return res.redirect('/')
    }
    await web3.eth.getBalance(public_key, function (err, wei) {
        balance = web3.utils.fromWei(wei, 'ether')
    });

    var sql = 'select txhash from txhash where userid = ?'
    db.query(sql, [userid], function (err, result) {
        if (err) {
            return res.render('err')
        }
        //let TxHashList = result[0].txhash;
        let txhash_list = [];
        for (i = 0; i < result.length; i++) {
            txhash_list.push(result[i].txhash)
        }
        return res.render('main', { title, userid, public_key, balance, txhash_list });
    })
});

router.get('/session_destroy', function (req, res) {
    req.session.destroy();  // 세션 삭제
    res.clearCookie('sid'); // 세션 쿠키 삭제
    res.redirect('/');
})

router.post('/deposit', async function (req, res) {
    let { userid } = req.session;
    let { result } = req.body;
    console.log(req.body.result)

    var sql = 'insert into txhash (userid, txhash) values(?, ?)'
    db.query(sql, [userid, result], function (err, results) {
        if (err) {
            return res.status(200).json({});
        }
        return res.status(202).json({});
    });
});

router.get('/private', function (req, res, next) {
    return res.render('private', { title: 'Private' });
  });

router.post('/account', function (req, res) {
    let { password } = req.body;
    let { private_key, userid} = req.session;
    let privatekey = CryptoJS.AES.decrypt(private_key, '123').toString(CryptoJS.enc.Utf8);

    var sql = 'select private_key, password from wallet_info where userid=?'
    bcrypt.compare(password, result[0].password, function (err, data) {
        if (data === true) {
            return res.status(202).json({});
        }
    });

})

module.exports = router;
