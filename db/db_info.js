const mySql = require('mysql');

const info = {
    host: 'localhost', // db ip address
    port: 3306,
    user: 'root', //db id
    password: '111111', //db pw
    database: 'ethwallet' //db schema name
}

const mysql = mySql.createConnection(info);

mysql.connect(); //mysql 접속

module.exports = {
    info,
    mysql
}