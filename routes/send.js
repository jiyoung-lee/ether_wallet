const express = require('express');
const Web3 = require('web3');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const Tx = require('ethereumjs-tx').Transaction;
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
  let { is_logined } = req.session;

  if (!is_logined) {
    return res.redirect('/')
  }
  res.render('send', { title: 'Send' });
});

router.post('/send_process', async function (req, res) {
  let { private_key, public_key, userid } = req.session;
  let { toAddress, value, gasPrice } = req.body;

  if (toAddress.length !== 42) {
    return res.redirect('/err')
  }
  let ckad = web3.utils.checkAddressChecksum(toAddress);
  if (ckad === false) {
    return res.redirect('/err')
  }
  if (typeof(value, gasPrice) !== Number){
    return res.redirect('/err')
  }

  let privateKey_ran = Buffer.from(private_key.substring(2), 'hex');
  let nonce = await web3.eth.getTransactionCount(public_key, "pending")
  let gwei = 9

  let rawTx = {
    nonce: nonce,
    gasPrice: web3.utils.toHex(gasPrice * (10 ** gwei)),
    gasLimit: web3.utils.toHex(21000),
    to: toAddress,
    from: public_key,
    value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
    data: ''
  }

  let tx = new Tx(rawTx, { 'chain': 'ropsten' });
  tx.sign(privateKey_ran);

  let serializedTx = tx.serialize();
  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
    if (err) {
      console.log('잔액부족')
      return res.redirect('/err')
    }
    var sql = 'insert into txhash (userid, txhash) values(?, ?)'
    db.query(sql, [userid, hash], function (err, result) {
      if (err) {
        return res.redirect('/err')
      }
      return res.redirect('/main')
    });
  });
});

module.exports = router;
