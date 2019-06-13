var express = require('express');
var socket = require('socket.io');

//App setup
var app = express();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_addr = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var server = app.listen(server_port, () => {
	console.log("Listening on address : " + server_ip_addr);
	console.log("Listening on port : " + server_port);
});

// Static Files
app.use(express.static('public'));

//Socket setup
var io = socket(server);

var infos = {
	numConnected: 0,
	startTime: new Date(),
};

// Socket connection
io.on('connection', (socket) => {
	console.log('Made socket connection', socket.id);

	infos.numConnected++;
	io.sockets.emit('update-stat', infos);

	//Chat Event
	//	When the server recieves a message from a socket
	socket.on('chat', (data) => {
		socket.broadcast.emit('chat', data);

		socket.username = data.username;

		let today = new Date();

		let today_str = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " at " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

		console.log(today_str);
		console.log(data.username + " (" + socket.id + ") : " + data.message);
		console.log('\n');
	});

	//Typing event
	//	When the client is typing
	socket.on('typing', (data) => {
		socket.broadcast.emit('typing', data);
	});

	socket.on('disconnect', () => {
		socket.broadcast.emit('user-disconnect', socket.username);
		console.log('User "' + socket.username + '" is now disconnected');
		infos.numConnected--;
		socket.broadcast.emit('update-stat', infos);
	});
});