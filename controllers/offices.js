const companyID = null;
function allOffices(connection, req, res) {

  const query = 'SELECT * FROM offices WHERE company = ?';
  connection.query(query, [req.query.id], (err, results) => {
    if (err) {
      console.log('Errore: ', err)
      return res.status(500).json({ error: 'Errore' });
    } else if (results.length > 0) {
      console.log(results)
      res.json({ message: 'Get all offices successful!', offices: results });
    } else {
      console.log('Errore nella richiesta (?)')
      res.json({ message: 'Errore nella richiesta (?)' });
    }
  });
}

function getOfficeByID(connection, req, res) {

  const query = 'SELECT * FROM offices WHERE id = ?';
  connection.query(query, [req.query.id], (err, results) => {
    if (err) {
      console.log('Errore: ', err)
      return res.status(500).json({ error: 'Errore' });
    } else if (results.length > 0) {
      console.log(results)
      res.json({ message: 'Get office successful!', office: results });
    } else {
      console.log('Errore nella richiesta (?)')
      res.json({ message: 'Errore nella richiesta (?)' });
    }
  });
}

function insertNewOffice(connection, req, res) {
  const { name, city, address, company } = req.body;
  const insertOfficeQuery = 'INSERT INTO offices (name, city, address, company) VALUES (?, ?, ?, ?)';
  connection.query(insertOfficeQuery, [name, city, address, company], (error, results, fields) => {
    if (error) {
      console.error('Errore durante l\'inserimento dell\'ufficio:', error);
      return res.status(500).json({ error: 'Errore durante l\'inserimento dell\'ufficio' });
    }
    console.log('Nuovo ufficio inserito con successo!');
    res.status(200).json({ message: 'Nuovo ufficio inserito con successo!', code: 200 });
  });
}

function deleteOffice(connection, req, res) {
  const { id } = req.body;
  const deleteOfficeQuery = 'DELETE FROM offices WHERE id = ?';
  connection.query(deleteOfficeQuery, [id], (error, results, fields) => {
    if (error) {
      console.error('Errore durante l\'eliminazione dell\'ufficio:', error);
      return res.status(500).json({ error: 'Errore durante l\'eliminazione dell\'ufficio' });
    }
    console.log('Ufficio eliminato con successo!');
    res.status(200).json({ message: 'Ufficio eliminato con successo!', code: 200 });
  });
}

module.exports = { allOffices, getOfficeByID, insertNewOffice, deleteOffice }