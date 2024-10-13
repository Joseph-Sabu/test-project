const sql = require('mssql/msnodesqlv8');

// Define your SQL Server connection configuration
const config = {
    server: 'LAPTOP-JQSP6PRO', // Replace with your SQL Server instance name, e.g., 'localhost\\SQLEXPRESS'
    database: 'YourDatabaseName', // Replace with your database name
    options: {
        trustedConnection: true // This enables Windows authentication
    },
    driver: 'msnodesqlv8', // Ensure you're using the msnodesqlv8 driver
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=localhost;Trusted_Connection=Yes;', // Add this for better compatibility
};

// Connect to the SQL Server
async function connectToSQLServer() {
    try {
        const pool = await sql.connect(config);
        console.log("Connected to SQL Server!");
        
        // Corrected query
        const result = await pool.request().query('SELECT * FROM Positions');
        console.log(result);
        
        // Close the connection pool
        pool.close();
    } catch (err) {
        console.error("Error connecting to SQL Server: ", err);
    }
}

// Call the function to connect
connectToSQLServer();
