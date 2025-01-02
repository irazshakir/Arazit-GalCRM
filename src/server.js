import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import imageUploadRouter from './routes/imageUpload.js';
import whatsappWebhookRouter from './api/webhooks/whatsapp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// Serve uploaded images
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
app.use('/api/images', imageUploadRouter);
app.use('/api/webhooks', whatsappWebhookRouter);

// All other routes should be handled by the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
