var express = require('express');
var socket = require('socket.io');

//App setup
var app = express();
var listenPort = 4000;
var server = app.listen(listenPort, () => {
	console.log("Listening on port : " + listenPort);
});

// Static Files
app.use(express.static('public'));

//Socket setup
var io = socket(server);

// Socket connection
io.on('connection', (socket) => {
	console.log('Made socket connection', socket.id);

	//Chat Event
	//	When the server recieves a message from a socket
	socket.on('chat', (data) => {
		io.sockets.emit('chat', data);
	});

	//Typing event
	//	When the client is typing
	socket.on('typing', (data) => {
		socket.broadcast.emit('typing', data);
	});
});