const express = require('express');
const mysql = require('mysql');
const cors = require ('cors');

const app = express();

app.use(cors());

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

app.get('/', (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      surname VARCHAR(255),
      email VARCHAR(255)
    )
  `;

  // Esegui la query per creare la tabella
  connection.query(createTableQuery, (error, results, fields) => {
    if (error) {
      console.error('Errore durante la creazione della tabella:', error);
      return res.status(500).json({ error: 'Errore durante la creazione della tabella' });
    }
    console.log('Tabella users creata con successo!');
    res.json({ message: 'Tabella users creata con successo!' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server è in ascolto sulla porta ${PORT}`);
});
