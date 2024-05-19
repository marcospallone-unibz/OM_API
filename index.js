const express = require('express');
const cors = require ('cors');
const { insertNewUser } = require('./controllers/users');
const createTable = require('./config/usersConfig')
const mysql = require('mysql');
const { authenticateUser } = require('./controllers/users')
const { allOffices } = require('./controllers/offices')

const app = express();

app.use(cors());

app.use(express.json());

const connection = mysql.createConnection({
  host: 'om.cdjkupklvmzr.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'password',
  database: 'om',
  port: 3306
});

connection.connect((err) => {
  if (err) {
      console.error('Errore di connessione al database:', err);
  } else {
      console.log('Connessione al database riuscita.');
  }
});

app.all("/", function(req, res, next) {
  req.header("Origin", "*"); // ideally the '*' will be your hostname
  return next();
});

app.get('/offices', (req, res) => {
  allOffices(connection, req, res);
});

app.post('/register', (req, res) => {
  insertNewUser(connection, req, res)
});

app.post('/login', (req, res) => {
  authenticateUser(connection, req, res)
});

const setDB = (connection) => {
  createTable(connection);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  setDB(connection)
  console.log(`Server è in ascolto sulla porta ${PORT}`);
});
