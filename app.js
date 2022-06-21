require('dotenv').config();
const app = require('express')();
const cors = require('cors');
app.use(cors());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://app.cadencechords.com');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});
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
const { testConnection } = require('./db/db');

io.on('connection', socket => {
  socket.on('disconnect', disconnect);

  socket.on('join session', joinSession);

  socket.on('perform scroll', performScroll);

  socket.on('perform change song', performChangeSong);

  socket.on('end session', endSession);
});

http.listen(port, async () => {
  testConnection();
});
