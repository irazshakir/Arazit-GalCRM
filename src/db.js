import { sql } from './config/db.js';

// Test database connection
async function testConnection() {
    try {
        await sql`SELECT 1`;
        console.log('Database connection successful');
    } catch (error) {
        console.error('Failed to connect to database:', error);
        throw error;
    }
}

// Initialize database connection
async function initializeDatabase() {
    try {
        await testConnection();
    } catch (error) {
        console.error('Failed to connect to database. Please check your connection settings.');
        process.exit(1);
    }
}

// Export both the sql client and the initialize function
export const db = {
    sql,
    initializeDatabase
};
