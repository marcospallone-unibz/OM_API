
function allOffices(connection, req, res) {
    const query = 'SELECT * FROM offices';
    connection.query(query, (err, results) => {
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