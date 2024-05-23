function allDevices(connection, req, res) {

  const query = 'SELECT * FROM devices WHERE office = ?';
  connection.query(query, [req.query.id], (err, results) => {
    if (err) {
      console.log('Errore: ', err)
      return res.status(500).json({ error: 'Errore' });
    } else if (results.length > 0) {
      console.log(results)
      res.json({ message: 'Get all devices successful!', devices: results });
    } else {
      console.log('Errore nella richiesta (?)')
      res.json({ message: 'Errore nella richiesta (?)' });
    }
  });
}

function getDeviceByID(connection, req, res) {

  const query = 'SELECT * FROM devices WHERE id = ?';
  connection.query(query, [req.query.id], (err, results) => {
    if (err) {
      console.log('Errore: ', err)
      return res.status(500).json({ error: 'Errore' });
    } else if (results.length > 0) {
      console.log(results)
      res.json({ message: 'Get all devices successful!', device: results });
    } else {
      console.log('Errore nella richiesta (?)')
      res.json({ message: 'Errore nella richiesta (?)' });
    }
  });
}

function insertNewDevice(connection, req, res) {
  const { name, state, office } = req.body;
  const insertDeviceQuery = 'INSERT INTO devices (name, state, office) VALUES (?, ?, ?)';
  connection.query(insertDeviceQuery, [name, state, office], (error, results, fields) => {
    if (error) {
      console.error('Errore durante l\'inserimento del device:', error);
      return res.status(500).json({ error: 'Errore durante l\'inserimento del device' });
    }
    console.log('Nuovo device inserito con successo!');
    res.status(200).json({ message: 'Nuovo device inserito con successo!', code: 200 });
  });
}

function deleteDevice(connection, req, res) {
  const { id } = req.body;
  const deleteDeviceQuery = 'DELETE FROM devices WHERE id = ?';
  connection.query(deleteDeviceQuery, [id], (error, results, fields) => {
    if (error) {
      console.error('Errore durante l\'eliminazione del device:', error);
      return res.status(500).json({ error: 'Errore durante l\'eliminazione del device' });
    }
    console.log('Device eliminato con successo!');
    res.status(200).json({ message: 'Device eliminato con successo!', code: 200 });
  });
}

module.exports = { allDevices, getDeviceByID, insertNewDevice, deleteDevice }