
function allUsersLength(connection) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users';
    connection.query(query, (err, results) => {
      if (err) {
        console.log('Errore: ', err)
        reject(new Error("Errore durante la richiesta" + err));
      } else if (results.length >= 0) {
        resolve(results.length);
      } else {
        console.log('Richiesta errata')
        reject(new Error("Errore durante la richiesta"));
      }
    });
  })
}

async function authenticateUser(connection, req, res) {
  return new Promise((resolve, reject) => {
    const { email, password } = req.body
    if (!email || !password) {
      console.log('Email e password sono obbligatorie');
    } else {
      const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
      connection.query(query, [email, password], (err, results) => {
        if (err) {
          console.log('Errore: ', err)
          reject(new Error("Errore durante la richiesta" + err));
        } else if (results.length > 0) {
          console.log('Login effettuato')
          resolve(results[0])
        } else {
          console.log('Credenziali errate')
          resolve("Credenziali errate");
        }
      });
    }
  })
}

async function insertNewUser(connection, req, res) {
  var { name, email, password, company } = req.body;
  if (company == undefined) {
    const results = await allUsersLength(connection);
    company = results + 1;
  }
  await new Promise((resolve, reject) => {
    const insertUserQuery = 'INSERT INTO users (name, email, password, company) VALUES (?, ?, ?, ?)';
    connection.query(insertUserQuery, [name, email, password, company], (error, results, fields) => {
      if (error) {
        console.error('Errore durante l\'inserimento dell\'utente:', error);
        reject(new Error("Errore durante l\'inserimento dell\'utente"));
      }
      console.log('Nuovo utente inserito con successo!');
      resolve('Utente inserito')
    });
  })
}

module.exports = { authenticateUser, insertNewUser }