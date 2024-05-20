
function allOffices(connection, req, res) {
  console.log('IDREQ', req.params)
  console.log('REQUEST', req)
    const query = 'SELECT * FROM offices WHERE company = ?';
    connection.query(query, [req.params.id], (err, results) => {
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

  module.exports = { allOffices }