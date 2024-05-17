const express = require('express');
const cors = require ('cors');
const dbConfig = require('./config/dbConfig')
const usersConfig = require('./config/usersConfig');
const { insertNewUser } = require('./controllers/users');

const app = express();

app.use(cors());

connection = dbConfig.connect();

app.all("/", function(req, res, next) {
  req.header("Origin", "*"); // ideally the '*' will be your hostname
  return next();
});

app.get('/', (req, res) => {
  
});

app.post('/newUser', (req, res) => {
  insertNewUser(connection, req, res)
});

const setDB = (connection) => {
  usersConfig.createTable(connection);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  setDB();
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
