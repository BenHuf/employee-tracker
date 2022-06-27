const mysql = require('mysql2');

const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '5698',
        database: 'employees'
});

module.exports = db;