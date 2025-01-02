import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import imageUploadRouter from './routes/imageUpload.js';
import whatsappWebhookRouter from './api/webhooks/whatsapp.js';

// Load environment variables first
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/images', imageUploadRouter);

// Only initialize webhook route if required environment variables are present
if (process.env.DATABASE_URL && process.env.GREEN_API_TOKEN) {
    app.use('/api/webhooks', whatsappWebhookRouter);
    console.log('WhatsApp webhook route initialized at /api/webhooks');
} else {
    console.warn('Required environment variables missing for webhook route');
    if (!process.env.DATABASE_URL) console.warn('Missing DATABASE_URL');
    if (!process.env.GREEN_API_TOKEN) console.warn('Missing GREEN_API_TOKEN');
}

// Debug route to check all registered routes
app.get('/api/routes', (req, res) => {
    const routes = [];
    app._router.stack.forEach(middleware => {
        if (middleware.route) {
            routes.push({
                path: middleware.route.path,
                methods: Object.keys(middleware.route.methods)
            });
        } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach(handler => {
                if (handler.route) {
                    routes.push({
                        path: handler.route.path,
                        methods: Object.keys(handler.route.methods)
                    });
                }
            });
        }
    });
    res.json(routes);
});

// Static file serving - AFTER API routes
app.use(express.static(path.join(__dirname, '../build')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// The catch-all route should be LAST
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start server
const startServer = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
