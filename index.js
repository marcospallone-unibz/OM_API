const express = require('express');
const cors = require ('cors');
const { insertNewUser } = require('./controllers/users');
const { createUsersTable } = require('./config/usersConfig')
const { createOfficiesTable } = require('./config/officesConfig')
const mysql = require('mysql');
const { authenticateUser } = require('./controllers/users')
const { allOffices, insertNewOffice, deleteOffice, getOfficeByID } = require('./controllers/offices');
const { createDevicesTable } = require('./config/devicesConfig');
const { insertNewDevice, allDevices, getDeviceByID } = require('./controllers/devices');

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
  console.log(res)
  allOffices(connection, req, res);
});

app.get('/devices', (req, res) => {
  console.log(res)
  allDevices(connection, req, res);
});

app.get('/singleOffice', (req, res) => {
  console.log(res)
  getOfficeByID(connection, req, res);
});

app.get('/singleDevice', (req, res) => {
  console.log(res)
  getDeviceByID(connection, req, res);
});

app.post('/register', (req, res) => {
  insertNewUser(connection, req, res)
});

app.post('/login', (req, res) => {
  authenticateUser(connection, req, res)
});

app.post('/newOffice', (req, res) => {
  insertNewOffice(connection, req, res)
});

app.post('/deleteOffice', (req, res) => {
  deleteOffice(connection, req, res)
});

app.post('/newDevice', (req, res) => {
  insertNewDevice(connection, req, res)
});

const setDB = (connection) => {
  createUsersTable(connection);
  createOfficiesTable(connection);
  createDevicesTable(connection);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  setDB(connection)
  console.log(`Server è in ascolto sulla porta ${PORT}`);
});
