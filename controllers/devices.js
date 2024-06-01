function allDevices(connection, req, res) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM devices WHERE office = ?';
    connection.query(query, [req.query.id], (err, results) => {
      if (err) {
        console.log('Errore: ', err)
        reject(new Error("Errore"));
      } else if (results.length > 0) {
        console.log(results)
        resolve(results);
      } else {
        console.log('Nessun device')
        resolve("Nessun device");
      }
    });
  })
}

function getDeviceByID(connection, req, res) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM devices WHERE id = ?';
    connection.query(query, [req.query.id], (err, results) => {
      if (err) {
        console.log('Errore: ', err)
        reject(new Error("Errore"));
      } else if (results.length > 0) {
        console.log(results)
        resolve(results);
      } else {
        console.log('Errore nella richiesta (?)')
        resolve("Nessun device");
      }
    });
  })
}

function insertNewDevice(connection, req, res) {
  return new Promise((resolve, reject) => {
    const { name, state, office } = req.body;
    const insertDeviceQuery = 'INSERT INTO devices (name, state, office) VALUES (?, ?, ?)';
    connection.query(insertDeviceQuery, [name, state, office], (error, results, fields) => {
      if (error) {
        console.error('Errore durante l\'inserimento del device:', error);
        reject(new Error("Errore durante l\'inserimento del device"));
      }
      console.log('Nuovo device inserito con successo!');
      resolve('Nuovo device inserito con successo');
    });
  })
}

function updateDevice(connection, req, res) {
  return new Promise((resolve, reject) => {
    const { state, deviceId } = req.body;
    const updateDeviceQuery = 'UPDATE devices SET state = ? WHERE id = ?';
    connection.query(updateDeviceQuery, [state, deviceId], (error, results, fields) => {
      if (error) {
        console.error('Errore durante l\'aggiornamento del device:', error);
        reject(new Error("Errore durante l\'aggiornamento del device"));
      }
      console.log('Device aggiornato con successo!');
      resolve('Device aggiornato con successo');
    });
  })
}

function deleteDevice(connection, req, res) {
  return new Promise((resolve, reject) => {
    const { id } = req.body;
    const deleteDeviceQuery = 'DELETE FROM devices WHERE id = ?';
    connection.query(deleteDeviceQuery, [id], (error, results, fields) => {
      if (error) {
        console.error('Errore durante l\'eliminazione del device:', error);
        reject(new Error("Errore durante l\'eliminazione del device"));
      }
      console.log('Device eliminato con successo!');
      resolve('Nuovo device eliminato con successo');
    });
  })
}

module.exports = { allDevices, getDeviceByID, insertNewDevice, updateDevice, deleteDevice }