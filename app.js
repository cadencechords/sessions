require('dotenv').config();
const app = require('express')();
const cors = require('cors');
app.use(cors());
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: '*',
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
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
