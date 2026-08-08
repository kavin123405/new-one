const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Serve React static build files (production)
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate safe, unique name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Database path
const dbPath = path.join(__dirname, 'database.json');

// Helper to read database
function readDB() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed reading database.json", error);
    return {};
  }
}

// Helper to write database
function writeDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error("Failed writing database.json", error);
    return false;
  }
}

// --- API ROUTES ---

// Get current configuration
app.get('/api/config', (req, res) => {
  const data = readDB();
  res.json(data);
});

// Update configuration
app.post('/api/config', (req, res) => {
  const newConfig = req.body;
  
  if (!newConfig || typeof newConfig !== 'object') {
    return res.status(400).json({ error: 'Invalid configuration payload' });
  }

  const success = writeDB(newConfig);
  if (success) {
    res.json({ message: 'Configuration saved successfully!' });
  } else {
    res.status(500).json({ error: 'Failed to write configuration file' });
  }
});

// Upload media file
app.post('/api/upload', upload.single('media'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Return the path relative to host
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// For any request that doesn't match API, serve the client React app index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
