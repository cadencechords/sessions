require('dotenv').config();
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ['https://app.cadencechords.com', 'https://admin.socket.io'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const { instrument } = require('@socket.io/admin-ui');
instrument(io, {
  auth:
    process.env.ENV === 'dev'
      ? false
      : {
          type: 'basic',
          username: process.env.SOCKETIO_ADMIN_USER,
          password: process.env.SOCKETIO_ADMIN_PASSWORD,
        },
});

const port = process.env.PORT || 3002;
let activeSessions = {};
const { disconnect } = require('./socket/connectionHandler')(
  io,
  activeSessions
);
const { joinSession, performScroll, performChangeSong, endSession } =
  require('./socket/sessionHandler')(io, activeSessions);

io.on('connection', socket => {
  socket.on('disconnect', disconnect);

  socket.on('join session', joinSession);

  socket.on('perform scroll', performScroll);

  socket.on('perform change song', performChangeSong);

  socket.on('end session', endSession);
});

http.listen(port, async () => {
  console.log(`Listening on port: ${port}`);
});
