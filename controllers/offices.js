const companyID = null;
function allOffices(connection, req, res) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM offices WHERE company = ?';
    connection.query(query, [req.query.id], (err, results) => {
      if (err) {
        console.log('Errore: ', err)
        reject(new Error("Errore"));
      } else if (results.length > 0) {
        console.log(results)
        resolve(results);
      } else {
        console.log('Nessun ufficio')
        reject(new Error("Nessun ufficio"));
      }
    });
  })
}

function getOfficeByID(connection, req, res) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM offices WHERE id = ?';
    connection.query(query, [req.query.id], (err, results) => {
      if (err) {
        console.log('Errore: ', err)
        reject(new Error("Errore"));
      } else if (results.length > 0) {
        console.log(results)
        resolve(results);
      } else {
        console.log('Nessun ufficio')
        reject(new Error("Nessun ufficio"));
      }
    });
  })

}

function insertNewOffice(connection, req, res) {
  return new Promise((resolve, reject) => {
    const { name, city, address, company } = req.body;
  const insertOfficeQuery = 'INSERT INTO offices (name, city, address, company) VALUES (?, ?, ?, ?)';
  connection.query(insertOfficeQuery, [name, city, address, company], (error, results, fields) => {
    if (error) {
      console.error('Errore durante l\'inserimento dell\'ufficio:', error);
      reject(new Error("Errore durante l\'inserimento dell\'ufficio:"));
    }
    console.log('Nuovo ufficio inserito con successo!');
    // res.status(200).json({ message: 'Nuovo ufficio inserito con successo!', code: 200 });
    resolve('Nuovo ufficio inserito con successo!');
  });
  })
  
}

function deleteOffice(connection, req, res) {
  return new Promise((resolve, reject) => {
    const { id } = req.body;
  const deleteOfficeQuery = 'DELETE FROM offices WHERE id = ?';
  connection.query(deleteOfficeQuery, [id], (error, results, fields) => {
    if (error) {
      console.error('Errore durante l\'eliminazione dell\'ufficio:', error);
      reject(new Error("Errore durante l\'eliminazione dell\'ufficio:"));
    }
    console.log('Ufficio eliminato con successo!');
    // res.status(200).json({ message: 'Ufficio eliminato con successo!', code: 200 });
    resolve('Ufficio eliminato con successo!');
  });
  })
  
}

module.exports = { allOffices, getOfficeByID, insertNewOffice, deleteOffice }