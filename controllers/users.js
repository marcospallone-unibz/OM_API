

 const insertNewUser = (connection, req, res) => {
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

module.exports = { insertNewUser }