const express = require('express');
const cors = require('cors');
const { insertNewUser } = require('./controllers/users');
const { createUsersTable } = require('./config/usersConfig')
const { createOfficiesTable } = require('./config/officesConfig')
const mysql = require('mysql');
const { authenticateUser } = require('./controllers/users')
const { allOffices, insertNewOffice, deleteOffice, getOfficeByID } = require('./controllers/offices');
const { createDevicesTable } = require('./config/devicesConfig');
const { insertNewDevice, allDevices, getDeviceByID, updateDevice, deleteDevice } = require('./controllers/devices');
const AWS = require('aws-sdk');
const sns = new AWS.SNS({ region: 'us-east-1' }); // Assicurati di specificare la regione corretta

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
});

app.get('/test', (req, res) => {
  let message = {
    FunctionToCall: 'test',
    RequestData: {
      body: 'body'
    }
  }
  console.log(res)
  // sendSnsMessage(message)
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
});

app.post('/register', (req, res) => {
  let message = {
    FunctionToCall: 'insertNewUser',
    RequestData: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      company: req.body.company
    }
  }
  sendSnsMessage(message)

  // insertNewUser(connection, req, res)
});

app.post('/login', (req, res) => {
  // let message = {
  //   FunctionToCall: 'authenticateUser',
  //   RequestData: {
  //     email: req.body.email,
  //     password: req.body.password
  //   }
  // }
  // sendSnsMessage(message)

  authenticateUser(connection, req, res)
});

app.post('/newOffice', (req, res) => {
  let message = {
    FunctionToCall: 'insertNewOffice',
    RequestData: {
      name: req.body.name,
      city: req.body.city,
      address: req.body.address,
      company: req.body.company
    }
  }
  sendSnsMessage(message)

  // insertNewOffice(connection, req, res)
});

app.post('/deleteOffice', (req, res) => {
  let message = {
    FunctionToCall: 'deleteOffice',
    RequestData: {
      id: req.body.id
    }
  }
  sendSnsMessage(message)

  // deleteOffice(connection, req, res)
});

app.post('/newDevice', (req, res) => {
  let message = {
    func: 'insertNewDevice',
    RequestData: {
      name: req.body.name,
      state: req.body.state,
      office: req.body.office
    }
  }
  sendSnsMessage(message)
  
  // insertNewDevice(connection, req, res)
});

app.post('/updateDevice', (req, res) => {
  let message = {
    FunctionToCall: 'updateDevice',
    RequestData: {
      state: req.body.state,
      deviceId: req.body.deviceId
    }
  }
  sendSnsMessage(message)

  // updateDevice(connection, req, res)
});

app.post('/deleteDevice', (req, res) => {
  let message = {
    FunctionToCall: 'deleteDevice',
    RequestData: {
      id: req.body.id
    }
  }
  sendSnsMessage(message)

  // deleteDevice(connection, req, res)
});

const setDB = (connection) => {
  let message = {
    FunctionToCall: 'createTables',
    RequestData: {}
  }
  sendSnsMessage(message)

  // createUsersTable(connection);
  // createOfficiesTable(connection);
  // createDevicesTable(connection);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  setDB(connection)
  console.log(`Server è in ascolto sulla porta ${PORT}`);
});
