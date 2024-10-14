const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Handle Excel upload and process the file
app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    //console.log("Simulated data", data);

    // Create nodes and links from the data
    const nodes = data.map(device => ({ id: device.Name, ip: device.IP }));
    const links = [];

    data.forEach(device => {
      if (device.ConnectsTo) {
          const connectedServers = device.ConnectsTo.split(',').map(name => name.trim());
          connectedServers.forEach(target => {
              // Check if the target exists in the nodes
              if (nodes.some(node => node.id === target)) {
                  links.push({ source: device.Name, target: target, value: 10 });
              } else {
                  console.warn(`Target node ${target} not found for ${device.Name}`);
              }
          });
      }
  });

    // Log nodes and links for debugging
    //console.log("Nodes:", nodes);
    //console.log("Links:", links);
   
   // Log the JSON response body to console
   const responseBody = { nodes, links };
   console.log('Response JSON:', JSON.stringify(responseBody, null, 2)); // Pretty print JSON

   // Send the response
   res.json(responseBody);


    // Send the nodes and links back to the frontend
    //res.json({ nodes, links });
});

// Serve the frontend HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
