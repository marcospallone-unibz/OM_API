const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

// const connection = mysql.createConnection({
//   host: 'be.cdjkupklvmzr.us-east-1.rds.amazonaws.com',
//   user: 'admin',
//   password: 'password',
//   database: 'be',
//   port: 3306
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Errore di connessione al database:', err);
//   } else {
//     console.log('Connessione al database riuscita.');
//   }
// });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://52.91.184.190:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello world!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server è in ascolto sulla porta ${PORT}`);
});
