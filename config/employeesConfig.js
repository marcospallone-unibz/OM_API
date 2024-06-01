
function createEmployeesTable(connection){
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(255),
      company INT
    )
  `;
  
  connection.query(createTableQuery, (error, results, fields) => {
    if (error) {
      console.error('Errore durante la creazione della tabella:', error);
    }
    console.log('Tabella employees creata con successo!');
  });
}

module.exports = { createEmployeesTable }