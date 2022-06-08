module.exports = (io, activeSessions) => {
  const disconnect = function (reason) {
    console.log(reason);
    const socket = this;
    if (socket.id in activeSessions) {
      delete activeSessions[socket.id];
    }
  };

  return {
    disconnect,
  };
};
