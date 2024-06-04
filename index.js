const express = require('express');
const cors = require('cors');
const { createUsersTable } = require('./config/usersConfig')
const { createOfficiesTable } = require('./config/officesConfig')
const mysql = require('mysql');
const { authenticateUser, insertNewUser } = require('./controllers/users')
const { allOffices, getOfficeByID, insertNewOffice, deleteOffice } = require('./controllers/offices');
const { createDevicesTable } = require('./config/devicesConfig');
const { allDevices, getDeviceByID, insertNewDevice, deleteDevice, updateDevice } = require('./controllers/devices');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const sendMetric = require('./cloudwatch-metrics');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { insertNewEmployee, allEmployees, deleteEmployee, updateEmployee } = require('./controllers/employees');
const { createEmployeesTable } = require('./config/employeesConfig');

const app = express();

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    sendMetric('ResponseTime', duration, 'Milliseconds');
    sendMetric('RequestCount', 1, 'Count');
  });

  next();
});

const connection = mysql.createConnection({
  host: 'om.ca4nvvqg6tk3.us-east-1.rds.amazonaws.com',
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

app.all("/", function (req, res, next) {
  req.header("Origin", "*");
  return next();
});

app.get('/offices', async (req, res) => {
  const response = await allOffices(connection, req, res);
  res.status(200).send(response)
});

app.get('/devices', async (req, res) => {
  const response = await allDevices(connection, req, res);
  res.status(200).send(response)

});

app.get('/singleOffice', async (req, res) => {
  const response = await getOfficeByID(connection, req, res);
  res.status(200).send(response)
});

app.get('/singleDevice', async (req, res) => {
  const response = await getDeviceByID(connection, req, res);
  res.status(200).send(response)
});

app.post('/register', async (req, res) => {
  await insertNewUser(connection, req, res)
  res.status(200).json({ message: 'Register effettuato!', code: 200}).send();
});

app.post('/login', async (req, res) => {
  const response = await authenticateUser(connection, req, res)
  res.status(200).json({ message: 'Login effettuato!', code: 200, id: response?.id, name:response?.name, company: response?.company}).send();
});

app.post('/newOffice', async (req, res) => {
  await insertNewOffice(connection, req, res)
  res.status(200).json({ message: 'Ufficio inserito!', code: 200}).send();
});

app.post('/deleteOffice', async (req, res) => {
  await deleteOffice(connection, req, res)
  res.status(200).json({ message: 'Ufficio eliminato!', code: 200}).send();
});

app.get('/employees', async (req, res) => {
  const response = await allEmployees(connection, req, res)
  res.status(200).send(response);
});

app.post('/newEmployee', async (req, res) => {
  await insertNewEmployee(connection, req, res)
  res.status(200).json({ message: 'Dipendente registrato!', code: 200}).send();
});

app.post('/updateEmployee', async (req, res) => {
  await updateEmployee(connection, req, res)
  res.status(200).json({ message: 'Dipendente aggiornato!', code: 200}).send();
});

app.post('/deleteEmployee', async (req, res) => {
  await deleteEmployee(connection, req, res)
  res.status(200).json({ message: 'Dipendente eliminato!', code: 200}).send();
});

app.post('/newDevice', async (req, res) => {
  await insertNewDevice(connection, req, res)
  res.status(200).json({ message: 'Dispositivo registrato!', code: 200}).send();
});

app.post('/updateDevice', async (req, res) => {
  await updateDevice(connection, req, res)
  res.status(200).json({ message: 'Dispositivo registrato!', code: 200}).send();
});

app.post('/deleteDevice', async (req, res) => {
  await deleteDevice(connection, req, res)
  res.status(200).json({ message: 'Dispositivo eliminato!', code: 200}).send();
});

app.post('/generateQR', async (req, res) => {
  try {
    const bucket = 'om-qr';
    const key = `${Date.now()}-QR.png`

    const qrCodePath = path.join(__dirname, 'qrcode.png');
    await QRCode.toFile(qrCodePath, 'qrcode-door');

    const fileContent = fs.readFileSync(qrCodePath);

    const params = {
      Bucket: bucket,
      Key: key,
      Body: fileContent,
      ContentType: 'image/png',
    };

    await s3.upload(params).promise();

    fs.unlinkSync(qrCodePath);

    const presignedUrl = s3.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: 60 * 1
    });

    res.status(200).json({ url: presignedUrl, code: 200 }).send();
  } catch (error) {
    console.error('Errore nella generazione o caricamento del QR Code:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

const setDB = (connection) => {
  createUsersTable(connection);
  createOfficiesTable(connection);
  createDevicesTable(connection);
  createEmployeesTable(connection);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  setDB(connection)
  console.log(`Server è in ascolto sulla porta ${PORT}`);
});