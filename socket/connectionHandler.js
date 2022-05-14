const Session = require("../db/session");

module.exports = (io, activeSessions) => {
  const disconnect = function (reason) {
    const socket = this;
    if (socket.id in activeSessions) {
      let session = activeSessions[socket.id];
      socket.to(session.id).emit("session ended");
      delete activeSessions[socket.id];

      console.log("disconnecting");
      Session.update(session.id, { status: "INACTIVE" });
    }
  };

  return {
    disconnect,
  };
};
