const sql = require('mssql/msnodesqlv8');  // Explicitly require msnodesqlv8 driver

const config = {
    server: 'LAPTOP-JQSP6PRO',       // Your SQL Server
    database: 'BPMeasurements',      // Database name
    options: {
        trustedConnection: true,     // Windows Authentication
        trustServerCertificate: true // Allow self-signed certificates
    }
};

sql.connect(config)
    .then(() => {
        console.log('Connected to the database successfully');
        return sql.close();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });
