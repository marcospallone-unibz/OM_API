const mysql = require('mysql');

export const connect = () =>{
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
    
    return connection;
}