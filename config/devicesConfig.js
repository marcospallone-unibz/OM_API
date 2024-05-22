function createDevicesTable(connection){
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS devices (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      state BOOLEAN DEFAULT false,
      office INT
    )
  `;
  
  connection.query(createTableQuery, (error, results, fields) => {
    if (error) {
      console.error('Errore durante la creazione della tabella:', error);
    }
    console.log('Tabella devices creata con successo!');
  });
}

module.exports = { createDevicesTable }