const { v4: uuidv4 } = require("uuid");

const {
      addToQueue,
      removeFromQueue,
      createMatch,
      handleDisconnect,
} = require("../services/matchmaking.service");

const {
      validateMessage,
      sendMessageToRoom,
} = require("../services/chat.service");

const { EVENTS } = require("../constants/events");
const { rateLimiter } = require("../utils/rateLimiter");

const socketHandler = (io) => {
      io.on("connection", (socket) => {
            const user = {
                  id: uuidv4().slice(0, 6),
                  socketId: socket.id,
                  roomId: null,
            };

            console.log(`User connected: ${user.id}`);

            socket.on(EVENTS.START, () => {
                  console.log(` ${user.id} is searching...`);

                  const match = addToQueue(user);

                  if (match) {
                        console.log(
                              `Match found: ${match.user1.id} ↔ ${match.user2.id}`
                        );

                        createMatch(match.user1, match.user2, io);
                  } else {
                        socket.emit(EVENTS.SEARCHING);
                  }
            });

            //  Messaging
            socket.on(EVENTS.SEND_MESSAGE, (data) => {
                  if (!rateLimiter(socket.id)) {
                        return socket.emit(EVENTS.ERROR, "Too many messages");
                  }

                  const { valid, error } = validateMessage(data?.message);

                  if (!valid) {
                        return socket.emit(EVENTS.ERROR, error);
                  }

                  if (!user.roomId) {
                        return socket.emit(EVENTS.ERROR, "Not connected to a chat");
                  }

                  console.log(
                        ` ${user.id} in room ${user.roomId}: ${data.message}`
                  );

                  sendMessageToRoom(io, socket, user.roomId, data.message);
            });

            // Skip chat
            socket.on(EVENTS.SKIP, () => {
                  console.log(`${user.id} skipped chat`);

                  handleDisconnect(user, io);

                  const match = addToQueue(user);

                  if (match) {
                        console.log(
                              `🤝 New match: ${match.user1.id} to ${match.user2.id}`
                        );

                        createMatch(match.user1, match.user2, io);
                  } else {
                        socket.emit(EVENTS.SEARCHING);
                  }
            });

            //  Disconnect
            socket.on("disconnect", () => {
                  console.log(`User disconnected: ${user.id}`);

                  handleDisconnect(user, io);
                  removeFromQueue(user.id);
            });

            socket.on(EVENTS.TYPING, () => {
                  if (user.roomId) {
                        socket.to(user.roomId).emit(EVENTS.TYPING);
                  }
            });

            socket.on(EVENTS.STOP_TYPING, () => {
                  if (user.roomId) {
                        socket.to(user.roomId).emit(EVENTS.STOP_TYPING);
                  }
            });
      });
};

module.exports = socketHandler;