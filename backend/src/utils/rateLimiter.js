const userMessages = {};

const rateLimiter = (socketId) => {
      const now = Date.now();

      if (!userMessages[socketId]) {
            userMessages[socketId] = [];
      }

      // keep last 1 second messages
      userMessages[socketId] = userMessages[socketId].filter(
            (t) => now - t < 1000
      );

      if (userMessages[socketId].length >= 5) {
            return false;
      }

      userMessages[socketId].push(now);
      return true;
};

module.exports = { rateLimiter };