import axios from 'axios';

// Green API Configuration
const config = {
    instanceId: process.env.GREEN_API_INSTANCE_ID,
    apiTokenInstance: process.env.GREEN_API_TOKEN,
    baseUrl: 'https://api.green-api.com',
    webhookUrl: process.env.GREEN_API_WEBHOOK_URL || 'https://4d20-2400-adc5-17e-8000-e5af-2465-4693-9959.ngrok-free.app/api/webhooks'
};

// Create axios instance with default config
const greenAPIClient = axios.create({
    baseURL: config.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add authentication and construct proper URL
greenAPIClient.interceptors.request.use((reqConfig) => {
    // Construct the URL with instance ID and token
    const url = reqConfig.url || '';
    reqConfig.url = `/waInstance${config.instanceId}/${url}/${config.apiTokenInstance}`;
    return reqConfig;
});

// Response interceptor for error handling
greenAPIClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('Green API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// Export both the config and the client
export { config, greenAPIClient };

// Helper function to check if Green API is properly configured
export const isGreenAPIConfigured = () => {
    return Boolean(config.instanceId && config.apiTokenInstance);
};
