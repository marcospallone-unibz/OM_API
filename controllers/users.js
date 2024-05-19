
function allUsers(connection, req, res) {
  const query = 'SELECT * FROM users';
  connection.query(query, (err, results) => {
    if (err) {
      console.log('Errore: ', err)
      return res.status(500).json({ error: 'Errore' });
    } else if (results.length > 0) {
      console.log(results)
      res.json({ message: 'Get all users successful!' + results.json() });
    } else {
      console.log('Errore nella richiesta (?)')
      res.json({ message: 'Errore nella richiesta (?)' });
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
        res.json({ message: 'Login effettuato!' });
      } else {
        console.log('Credenziali errate')
        res.json({ message: 'Credenziali errate!' });
      }
    });
  }
}

function insertNewUser(connection, req, res) {
  console.log('40', + req)
  // Recupero dei dati inviati nella richiesta POST
  const { name, surname, email, password } = req.body;

  console.log(name, surname, email, password)

  // Esecuzione della query di inserimento
  const insertUserQuery = 'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)';
  connection.query(insertUserQuery, [name, surname, email, password], (error, results, fields) => {
    if (error) {
      console.error('Errore durante l\'inserimento dell\'utente:', error);
      return res.status(500).json({ error: 'Errore durante l\'inserimento dell\'utente' });
    }
    console.log('Nuovo utente inserito con successo!');
    res.json({ message: 'Nuovo utente inserito con successo!' + name + surname + email + password });
  });
}

module.exports = { insertNewUser, authenticateUser, allUsers }