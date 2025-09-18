const { Server } = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [
        'https://drive-x-frontend.vercel.app',
        'http://localhost:5173',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join', async ({ userId, userType }) => {
      try {
        if (userType === 'user') {
          await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === 'captain') {
          await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
        }
      } catch (err) {
        console.error('Join error:', err);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    socket.on('update-location-captain', async ({ userId, location }) => {
      if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
        return socket.emit('error', { message: 'Invalid location data' });
      }
      try {
        await captainModel.findByIdAndUpdate(userId, {
          location: {
            lat: location.lat,
            lng: location.lng,
          },
        });
      } catch (err) {
        console.error('Update location error:', err);
        socket.emit('error', { message: 'Failed to update location' });
      }
    });

    socket.on('disconnect', async () => {
      console.log(`Client disconnected: ${socket.id}`);
      // Optionally remove socketId from users/captains
      try {
        await userModel.updateMany({ socketId: socket.id }, { $unset: { socketId: 1 } });
        await captainModel.updateMany({ socketId: socket.id }, { $unset: { socketId: 1 } });
      } catch (err) {
        console.error('Error clearing socketId on disconnect:', err);
      }
    });
  });
}

function sendMessageToSocketId(socketId, { event, data }) {
  if (!io) return console.warn('Socket.io not initialized');
  if (!socketId || !event) return console.warn('Missing socketId or event');

  io.to(socketId).emit(event, data);
}

module.exports = { initializeSocket, sendMessageToSocketId };
