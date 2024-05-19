
function authenticateUser(connection, req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    console.log('Email e password sono obbligatorie');
  } else {
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    connection.query(query, [email, password], (err, results) => {
      if (err) {
        console.log('Errore: ', err)
        return res.status(500).json({ error: 'Errore durante il login' });
      } else if (results.length > 0) {
        console.log('Login effettuato')
        res.status(200).json({ message: 'Login effettuato!', code: 200 });
      } else {
        console.log('Credenziali errate')
        res.json({ message: 'Credenziali errate!' });
      }
    });
  }
}

function insertNewUser(connection, req, res) {
  // Recupero dei dati inviati nella richiesta POST
  const { name, surname, email, password } = req.body;

  // Esecuzione della query di inserimento
  const insertUserQuery = 'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)';
  connection.query(insertUserQuery, [name, surname, email, password], (error, results, fields) => {
    if (error) {
      console.error('Errore durante l\'inserimento dell\'utente:', error);
      return res.status(500).json({ error: 'Errore durante l\'inserimento dell\'utente' });
    }
    console.log('Nuovo utente inserito con successo!');
    res.status(200).json({ message: 'Nuovo utente inserito con successo!', code: 200});
  });
}

module.exports = { insertNewUser, authenticateUser }