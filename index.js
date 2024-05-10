const express = require('express');
const mysql = require('mysql');

const app = express();

const connection = mysql.createConnection({
    host: 'be.cdjkupklvmzr.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'password',
    database: 'be'
});

connection.connect((err) => {
    if (err) {
        console.error('Errore di connessione al database:', err);
    } else {
        console.log('Connessione al database riuscita.');
    }
});

// Definisci le route e i controller qui...

const PORT = process.env.DB_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server è in ascolto sulla porta ${PORT}`);
});
