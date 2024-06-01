
function allEmployees(connection, req, res) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM employees WHERE company = ?';
      connection.query(query, [req.query.id], (err, results) => {
        if (err) {
          console.log('Errore: ', err)
          reject(new Error("Errore"));
        } else if (results.length > 0) {
          resolve(results);
        } else {
          console.log('Nessun dipendente')
          resolve("Nessun dipendente");
        }
      });
    })
  }
  
  async function insertNewEmployee(connection, req, res) {
    var { name, email, phone, company } = req.body;
    await new Promise((resolve, reject) => {
      const insertUserQuery = 'INSERT INTO users (name, email, phone, company) VALUES (?, ?, ?, ?)';
      connection.query(insertUserQuery, [name, email, phone, company], (error, results, fields) => {
        if (error) {
          console.error('Errore durante l\'inserimento del dipendente:', error);
          reject(new Error("Errore durante l\'inserimento del dipendente"));
        }
        console.log('Nuovo dipendente inserito con successo!');
        resolve('Dipendente inserito')
      });
    })
  }

  function updateEmployee(connection, req, res) {
    return new Promise((resolve, reject) => {
      const { id, name, email, phone, company } = req.body;
      const updateEmployeeQuery = 'UPDATE employees SET name = ?, email = ?, phone = ?, company = ? WHERE id = ?';
      connection.query(updateEmployeeQuery, [name, email, phone, company, id], (error, results, fields) => {
        if (error) {
          console.error('Errore durante l\'aggiornamento del dipendente:', error);
          reject(new Error("Errore durante l\'aggiornamento del dipendente"));
        }
        console.log('Dipendente aggiornato con successo!');
        resolve('Dipendente aggiornato con successo');
      });
    })
  }

  function deleteEmployee(connection, req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.body;
    const deleteOfficeQuery = 'DELETE FROM employees WHERE id = ?';
    connection.query(deleteOfficeQuery, [id], (error, results, fields) => {
      if (error) {
        console.error('Errore durante l\'eliminazione del dipendente:', error);
        reject(new Error("Errore durante l\'eliminazione del dipendente:"));
      }
      console.log('Dipendente eliminato con successo!');
      resolve('Dipendente eliminato con successo!');
    });
    })
    
  }
  
  module.exports = { allEmployees, insertNewEmployee, updateEmployee, deleteEmployee }