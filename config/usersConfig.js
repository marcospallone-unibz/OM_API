
export const createTable = (connection) => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      surname VARCHAR(255),
      email VARCHAR(255),
      password VARCHAR(255)
    )
  `;
  
  connection.query(createTableQuery, (error, results, fields) => {
    if (error) {
      console.error('Errore durante la creazione della tabella:', error);
      return res.status(500).json({ error: 'Errore durante la creazione della tabella' });
    }
    console.log('Tabella users creata con successo!');
    res.json({ message: 'Tabella users creata con successo!' });
  });
}



