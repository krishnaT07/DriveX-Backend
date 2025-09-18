const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

console.log('Current directory:', process.cwd());
console.log('Server.js loaded successfully');

// Initialize Socket.IO
initializeSocket(server);

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown (SIGTERM & SIGINT)
const shutdown = () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown); // Ctrl+C handling for local dev

// Handle uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
