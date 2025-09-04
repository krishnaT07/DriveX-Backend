const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const port = process.env.PORT || 3000;

const server = http.createServer(app);
console.log('Current directory:', process.cwd());

// Initialize socket.io with the server
initializeSocket(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Handle graceful shutdown (e.g., SIGTERM for production)
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception: ', err);
    process.exit(1);
});
