const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "sql12.freesqldatabase.com",
    user: "sql12825289",
    password: "9N1K6TllVq",   
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.log("DB Connection Error:", err);
    } else {
        console.log("MySQL Connected Successfully");
    }
});

module.exports = db;