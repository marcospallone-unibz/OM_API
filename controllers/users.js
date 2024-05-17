
function authenticateUser(connection, req, res) {
  const { email, password } = req.query
  if (!email || !password) {
    console.log('Email e password sono obbligatorie');
  } else {
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    connection.query(query, [email, password], (err, results) => {
      if (results.length > 0) {
        return true;
      } else {
        if(err){
          console.log(err)
          return false;
        }
        return false;
      }
    });
  }
}

function insertNewUser(connection, req, res) {
  // Recupero dei dati inviati nella richiesta POST
  const { name, surname, email, password } = req.query;

  // Esecuzione della query di inserimento
  const insertUserQuery = 'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)';
  connection.query(insertUserQuery, [name, surname, email, password], (error, results, fields) => {
    if (error) {
      console.error('Errore durante l\'inserimento dell\'utente:', error);
      return res.status(500).json({ error: 'Errore durante l\'inserimento dell\'utente' });
    }
    console.log('Nuovo utente inserito con successo!');
    res.json({ message: 'Nuovo utente inserito con successo!' });
  });
}

module.exports = { insertNewUser, authenticateUser }