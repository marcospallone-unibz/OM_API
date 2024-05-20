const crypto = require('crypto');

function authenticateCompany(connection, req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    console.log('Email e password sono obbligatorie');
  } else {
    const query = 'SELECT * FROM companies WHERE email = ? AND password = ?';
    connection.query(query, [email, password], (err, results) => {
      if (err) {
        console.log('Errore: ', err)
        return res.status(500).json({ error: 'Errore durante il login' });
      } else if (results.length > 0) {
        console.log('Login effettuato')
        const token = crypto.randomBytes(32).toString('hex');
        res.status(200).json({ message: 'Login effettuato!', code: 200, token: token });
      } else {
        console.log('Credenziali errate')
        res.json({ message: 'Credenziali errate!' });
      }
    });
  }
}

function insertNewCompany(connection, req, res) {
  // Recupero dei dati inviati nella richiesta POST
  const { name, email, password } = req.body;

  // Esecuzione della query di inserimento
  const insertCompanyQuery = 'INSERT INTO companies (name, email, password) VALUES (?, ?, ?)';
  connection.query(insertCompanyQuery, [name, email, password], (error, results, fields) => {
    if (error) {
      console.error('Errore durante l\'inserimento dell\'azienda:', error);
      return res.status(500).json({ error: 'Errore durante l\'inserimento dell\'azienda' });
    }
    console.log('Nuova azienda inserita con successo!');
    res.status(200).json({ message: 'Nuova azienda inserita con successo!', code: 200});
  });
}

module.exports = { insertNewCompany, authenticateCompany }