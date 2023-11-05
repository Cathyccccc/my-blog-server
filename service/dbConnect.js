const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wzjdwlnl',
  database: 'my-blog',
  // ssl  : {
  //   ca : fs.readFileSync(__dirname + '/mysql-ca.crt')
  // }
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
})

module.exports = connection;