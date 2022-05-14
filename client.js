const io = require("socket.io");
var socket = io("http://localhost:3000");
socket.emit("join session", { sessionId: 1000 });
