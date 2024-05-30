const express = require('express');
const cors = require('cors');
const { createUsersTable } = require('./config/usersConfig')
const { createOfficiesTable } = require('./config/officesConfig')
const mysql = require('mysql');
const { authenticateUser, insertNewUser } = require('./controllers/users')
const { allOffices, getOfficeByID, insertNewOffice, deleteOffice } = require('./controllers/offices');
const { createDevicesTable } = require('./config/devicesConfig');
const { allDevices, getDeviceByID, insertNewDevice, deleteDevice } = require('./controllers/devices');
const AWS = require('aws-sdk');
const sns = new AWS.SNS({ region: 'us-east-1' }); // Assicurati di specificare la regione corretta
const winston = require('winston');
const expressWinston = require('express-winston');
const morgan = require('morgan');
const sendMetric = require('./cloudwatch-metrics');

const topicArn = 'arn:aws:sns:us-east-1:869141024194:om'; // Sostituisci con il tuo ARN del topic SNS

const sendSnsMessage = (message) => {
  const params = {
    Message: JSON.stringify(message),
    TopicArn: topicArn
  };

  return sns.publish(params).promise();
};

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

// Configura il logger di Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ],
});

// Configura Morgan per il logging delle richieste HTTP
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Middleware per registrare richieste con express-winston
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'requests.log' }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}} - {{res.statusCode}} {{res.responseTime}}ms", // optional: customize the default logging message.
  expressFormat: true, // Use the default Express/morgan request formatting
  colorize: false, // Color the text and status code
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

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

app.all("/", function (req, res, next) {
  req.header("Origin", "*"); // ideally the '*' will be your hostname
  return next();
});

app.get('/offices', (req, res) => {
  // let message = {
  //   FunctionToCall: 'allOffices',
  //   RequestData: {
  //     id: req.query.id
  //   }
  // }
  // sendSnsMessage(message)

  allOffices(connection, req, res);
  res.send('GETUffici')
});

app.get('/devices', (req, res) => {
  // let message = {
  //   func: 'allDevices',
  //   RequestData: {
  //     id: req.query.id
  //   }
  // }
  // sendSnsMessage(message);

  allDevices(connection, req, res);
  res.send('GETDevices')

});

app.get('/singleOffice', (req, res) => {
  // let message = {
  //   FunctionToCall: 'getOfficeByID',
  //   RequestData: {
  //     id: req.query.id
  //   }
  // }
  // sendSnsMessage(message);

  getOfficeByID(connection, req, res);
  res.send('GETUfficio')
});

app.get('/singleDevice', (req, res) => {
  // let message = {
  //   FunctionToCall: 'getDeviceByID',
  //   RequestData: {
  //     id: req.query.id
  //   }
  // }
  // sendSnsMessage(message)

  getDeviceByID(connection, req, res);
  res.send('GETDevice')
});

app.post('/register', async (req, res) => {
  // let message = {
  //   FunctionToCall: 'insertNewUser',
  //   RequestData: {
  //     name: req.body.name,
  //     email: req.body.email,
  //     password: req.body.password
  //   }
  // }
  // sendSnsMessage(message)
  // res.send('Utente registrato');

  const response = await insertNewUser(connection, req, res)
  res.status(200).json({ message: 'Register effettuato!', code: 200});
});

app.post('/login', async (req, res) => {
  // let message = {
  //   FunctionToCall: 'authenticateUser',
  //   RequestData: {
  //     email: req.body.email,
  //     password: req.body.password
  //   }
  // }
  // sendSnsMessage(message)

  const response = await authenticateUser(connection, req, res)
  res.status(200).json({ message: 'Login effettuato!', code: 200, id: response[0].id, company: response[0].company});
  // res.send('Login')
});

app.post('/newOffice', (req, res) => {
  // let message = {
  //   FunctionToCall: 'insertNewOffice',
  //   RequestData: {
  //     name: req.body.name,
  //     city: req.body.city,
  //     address: req.body.address,
  //     company: req.body.company
  //   }
  // }
  // sendSnsMessage(message)

  insertNewOffice(connection, req, res)
  res.send('Ufficio registrato');

});

app.post('/deleteOffice', (req, res) => {
  // let message = {
  //   FunctionToCall: 'deleteOffice',
  //   RequestData: {
  //     id: req.body.id
  //   }
  // }
  // sendSnsMessage(message)
  // res.send('Ufficio eliminato');

  // deleteOffice(connection, req, res)
  res.send('Ufficio eliminato');
});

app.post('/newDevice', (req, res) => {
  // let message = {
  //   FunctionToCall: 'insertNewDevice',
  //   RequestData: {
  //     name: req.body.name,
  //     state: req.body.state,
  //     office: req.body.office
  //   }
  // }
  // sendSnsMessage(message)
  // res.send('Dispositivo registrato');
  
  insertNewDevice(connection, req, res)
  res.send('Dispositivo registrato');

});

app.post('/updateDevice', (req, res) => {
  // let message = {
  //   FunctionToCall: 'updateDevice',
  //   RequestData: {
  //     state: req.body.state,
  //     deviceId: req.body.deviceId
  //   }
  // }
  // sendSnsMessage(message)
  // res.send('Dispositivo aggiornato');

  updateDevice(connection, req, res)
  res.send('Dispositivo aggiornato');
});

app.post('/deleteDevice', (req, res) => {
  // let message = {
  //   FunctionToCall: 'deleteDevice',
  //   RequestData: {
  //     id: req.body.id
  //   }
  // }
  // sendSnsMessage(message)
  // res.send('Dispositivo eliminato');

  deleteDevice(connection, req, res)
  res.send('Dispositivo eliminato');
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
