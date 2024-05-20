const jwt = require('jsonwebtoken');

function allOffices(connection, req, res) {
    const query = 'SELECT * FROM offices';
    connection.query(query, (err, results) => {
      if (err) {
        console.log('Errore: ', err)
        return res.status(500).json({ error: 'Errore' });
      } else if (results.length > 0) {
        console.log(results)
        res.json({ message: 'Get all offices successful!', offices: results.json() });
      } else {
        console.log('Errore nella richiesta (?)')
        res.json({ message: 'Errore nella richiesta (?)' });
      }
    });
  }

  function verifyToken(req, res, next) {
    // Ottieni il token dall'intestazione Authorization
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({ message: 'Token mancante' });
    }
  
    // Verifica il token
    jwt.verify(token, 'secret_key', (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token non valido' });
      }
      // Decodifica il token e aggiungi l'utente all'oggetto della richiesta
      req.user = decoded;
      next();
    });
  }

  module.exports = { allOffices, verifyToken }