let queue = [];
let rooms = {};

// Add user to queue
const addToQueue = (user) => {
      if (queue.length > 0) {
            const partner = queue.shift();
            return { user1: user, user2: partner };
      } else {
            queue.push(user);
            return null;
      }
};

// Remove user from queue
const removeFromQueue = (userId) => {
      queue = queue.filter((u) => u.id !== userId);
};

// Create chat room
const createMatch = (user1, user2, io) => {
      const roomId = `room-${Date.now()}`;

      user1.roomId = roomId;
      user2.roomId = roomId;

      rooms[roomId] = [user1, user2];

      const socket1 = io.sockets.sockets.get(user1.socketId);
      const socket2 = io.sockets.sockets.get(user2.socketId);

      socket1 && socket1.join(roomId);
      socket2 && socket2.join(roomId);

      io.to(roomId).emit("matched");
};

// Handle disconnect / skip
const handleDisconnect = (user, io) => {
      if (!user.roomId) return;

      const users = rooms[user.roomId];
      if (!users) return;

      const partner = users.find((u) => u.id !== user.id);

      if (partner) {
            io.to(partner.socketId).emit("partner_disconnected");
            partner.roomId = null;

            // requeue partner
            queue.push(partner);
      }

      delete rooms[user.roomId];
};

module.exports = {
      addToQueue,
      removeFromQueue,
      createMatch,
      handleDisconnect,
};