const express = require('express');
const router = express.Router();

const db = require('../public/js/db')
const session = require('express-session');
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);

router.use(bodyParser.urlencoded({ extended: false }));

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

router.post('/login_process', function (req, res) {
    var { id, password } = req.body;
});


module.exports = router;
