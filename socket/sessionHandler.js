const Session = require('../db/session');
const AuthApi = require('../api/authApi.js');

module.exports = (io, activeSessions) => {
  const joinSession = async function ({ sessionId, auth, teamId }) {
    const socket = this;
    let session = await Session.find(sessionId);

    // Make sure this session exists
    if (!session) return;

    // Make sure the session is active
    if (session.status !== 'ACTIVE') return;

    // Make sure the user is logged in
    let me = await AuthApi.getMe(auth);
    if (!me) return;

    // Make sure the user is part of the team whose session they are trying to join

    if (me.id === session.creatorId) activeSessions[socket.id] = session;
    else {
      socket.emit('initial data', {
        scrollTop: session.scrollTop,
        songIndex: session.songIndex,
      });
    }

    socket.join(sessionId);
  };

  const performScroll = async function ({ scrollTop, sessionId }) {
    const socket = this;
    let s = await Session.find(sessionId);

    if (!s || s.status === 'INACTIVE') {
      socket.emit('inactive session');
      socket.to(sessionId).emit('host ended session');
    } else {
      socket.to(sessionId).emit('scroll to', scrollTop);
      Session.update(sessionId, { scrollTop });
    }
  };

  const performChangeSong = async function ({ songIndex, sessionId }) {
    const socket = this;
    let s = await Session.find(sessionId);
    if (!s || s.status === 'INACTIVE') {
      socket.emit('inactive session');
      socket.to(sessionId).emit('host ended session');
    } else {
      socket.to(sessionId).emit('go to song', songIndex);
      Session.update(sessionId, { songIndex });
    }
  };

  const endSession = function ({ sessionId }) {
    const socket = this;
    socket.to(sessionId).emit('host ended session');
  };

  return {
    joinSession,
    performScroll,
    performChangeSong,
    endSession,
  };
};
