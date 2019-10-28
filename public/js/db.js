const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost', // db ip address
    user: 'root', //db id
    password: '111111', //db pw
    database: 'ethwallet' //db schema name
});

module.exports = db;