const mysql = require("mysql2/promise");
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "wzjdwlnl",
//   database: "my-blog",
//   port: 3306,
//   // ssl  : {
//   //   ca : fs.readFileSync(__dirname + '/mysql-ca.crt')
//   // }
// });

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "wzjdwlnl",
  database: "my-blog",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// connection.connect(function (err) {
//   if (err) {
//     console.error("error connecting: " + err.stack);
//     return;
//   }
//   console.log("mysql database connected as id " + connection.threadId);
// });

module.exports = connection;
