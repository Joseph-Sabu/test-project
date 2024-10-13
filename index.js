const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const sql = require('mssql');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure MSSQL
/*const config = {
   server: 'LAPTOP-JQSP6PRO',  // Your SQL Server instance
   database: 'BPMeasurements',              // Your database name
   options: {
       trustedConnection: true,             // Enables Windows Authentication
       encrypt: false,                      // Set to true for Azure SQL
       trustServerCertificate: true         // For local development
   }
};


// Connect to MSSQL
sql.connect(config, (err) => {
   if (err) {
       console.error('Error connecting to the database:', err);
   } else {
       console.log('Connected to the database');
   }
}); */

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Handle Excel upload and process the file
app.post('/upload', upload.single('file'), (req, res) => {
   const filePath = req.file.path;
   const workbook = xlsx.readFile(filePath);
   const sheet = workbook.Sheets[workbook.SheetNames[0]];
   const data = xlsx.utils.sheet_to_json(sheet);

   console.log("Simulated data",data);

   data.forEach(device => {
   console.log(`Simulated individual data: Name: ${device.Name}, IP: ${device.IP}`);   
   });

   data.forEach(device => {
      const query = `INSERT INTO Servers (name, ip_address) VALUES ('${device.Name}', '${device.IP}')`;
      sql.query(query, (err) => {
         if (err) console.error(err);
      });
   });

   res.send('File processed successfully');
});

// Serve the frontend HTML page
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server
app.listen(3000, () => {
   console.log('Server is running on port 3000');
});
