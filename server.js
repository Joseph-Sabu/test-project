const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors({ origin: '*' }));

app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/NetworkVisualizer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Configuring Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Function to determine device type based on its name
function determineDeviceType(name) {
    if (name.toLowerCase().includes('server')) {
        return 'server';
    } else if (name.toLowerCase().includes('firewall')) {
        return 'firewall';
    } else {
        return 'unknown';
    }
}


// Middleware for session
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'Network@#45Visualizer',
    resave: false,
    saveUninitialized: false,
}));


// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Middleware to make user globally available in templates
app.use((req, res, next) => {
    res.locals.user = req.session.userId || null;
    next();
});

// Routes
app.get('/login', (req, res) => {
    res.render('login', { user: req.session.userId ? true : null });
});

app.get('/register', (req, res) => {
    res.render('register', { user: req.session.userId ? true : null });
});

app.get('/', (req, res) => {
    res.render('home', { user: req.session.userId ? true : null });
});

app.get('/visualizer', isAuthenticated, (req, res) => {
    res.render('visualizer', { user: true, nodes: [], links: [] });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
});

// Handling Excel upload and process the file
app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    //console.log("Simulated data", data);

    // Create nodes and links from the data
    const nodes = data.map(device => ({
        id: device.Name,
        ip: device.IP,
        type: determineDeviceType(device.Name)
    }));
    const links = [];

    data.forEach(device => {
      if (device.ConnectsTo) {
          const connectedServers = device.ConnectsTo.split(',').map(name => name.trim());
          connectedServers.forEach(target => {
              // Checking if the target exists in the nodes
              if (nodes.some(node => node.id === target)) {
                  links.push({ source: device.Name, target: target, value: 10 });
              } else {
                  console.warn(`Target node ${target} not found for ${device.Name}`);
              }
          });
      }
  });

    //console.log("Nodes:", nodes);
    //console.log("Links:", links);
   
   // Loggin the JSON response body
   const responseBody = { nodes, links };
   console.log('Response JSON:', JSON.stringify(responseBody, null, 2)); // Pretty print JSON

   // Send the response
   res.json(responseBody);

});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.status(400).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;
            res.redirect('/visualizer');
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Something went wrong. Please try again later.' });
    }
});


// Starting the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
