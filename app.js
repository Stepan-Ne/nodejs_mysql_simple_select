const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const query = `SELECT col.fullname, col.birth_date, learning.score FROM col INNER JOIN learning ON col.id = learning.col_id AND learning.course_name = 'excel' AND learning.score > 80 AND col.subdivision_name = 'booker'`;

const pool = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'databaseName',
});

app.get('', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(query, (err, rows) => {
      connection.release()  // return the connection to pool

      if (!err) {
        res.send(rows)
      } else {
        console.log(err)
      }
    })
  });
});

app.listen(port, () => console.log('The server is running ...'));
