
function allUsersLength(connection) {
  const query = 'SELECT * FROM users';
    connection.query(query, (err, results) => {
      if (err) {
        console.log('Errore: ', err)
        return 0;
      } else if (results.length > 0) {
        console.log('GET utenti a buon fine')
        return results.length;
      } else {
        console.log('Richiesta errata')
        return 0;
      }
    });
}

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
        res.status(200).json({ message: 'Login effettuato!', code: 200, id: results[0].id, company: results[0].company});
      } else {
        console.log('Credenziali errate')
        res.json({ message: 'Credenziali errate!' });
      }
    });
  }
}

function insertNewUser(connection, req, res) {
  // Recupero dei dati inviati nella richiesta POST
  var { name, email, password, company } = req.body;

  if(company == null){
    const results = allUsersLength(connection);
    company = results + 1;
  }

  // Esecuzione della query di inserimento
  const insertUserQuery = 'INSERT INTO users (name, email, password, company) VALUES (?, ?, ?, ?)';
  connection.query(insertUserQuery, [name, email, password, company], (error, results, fields) => {
    if (error) {
      console.error('Errore durante l\'inserimento dell\'utente:', error);
      return res.status(500).json({ error: 'Errore durante l\'inserimento dell\'utente' });
    }
    console.log('Nuovo utente inserito con successo!');
    res.status(200).json({ message: 'Nuovo utente inserito con successo!', code: 200});
  });
}

module.exports = { authenticateUser, insertNewUser }