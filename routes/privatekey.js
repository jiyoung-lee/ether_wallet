const express = require('express');
const Web3 = require('web3');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const CryptoJS = require('crypto-js');

const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: false }));

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
