const { Timestamp } = require("mongodb");

const MAX_MESSAGE_LENGTH = 500;

// Validate message
const validateMessage = (message) => {
      if (!message || typeof message !== "string") {
            return { valid: false, error: "Invalid message format" };
      }

      if (message.trim().length === 0) {
            return { valid: false, error: "Message cannot be empty" };
      }

      if (message.length > MAX_MESSAGE_LENGTH) {
            return { valid: false, error: "Message too long" };
      }

      return { valid: true };
};

// Send message to room
const sendMessageToRoom = (io, socket, roomId, message) => {
      socket.to(roomId).emit("receive_message", {
            message,
            timestamp : new Date().toISOString()
      });
};

module.exports = {
      validateMessage,
      sendMessageToRoom,
};