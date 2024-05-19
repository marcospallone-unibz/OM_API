
function createTable(connection){
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS offices (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      city VARCHAR(255),
      address VARCHAR(255)
    )
  `;
  
  connection.query(createTableQuery, (error, results, fields) => {
    if (error) {
      console.error('Errore durante la creazione della tabella:', error);
    }
    console.log('Tabella users creata con successo!');
  });
}

module.exports = createTable