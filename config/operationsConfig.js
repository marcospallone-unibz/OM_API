
function createOperationLog(connection){
    const operationsLogQuery = `
    CREATE TABLE operation_log (
        request_id VARCHAR(255) PRIMARY KEY,
        operation_details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  connection.query(operationsLogQuery, (error, results, fields) => {
    if (error) {
      console.error('Errore durante la creazione della tabella:', error);
    }
    console.log('Tabella log creata con successo!');
  });
}

module.exports = { createOperationLog }