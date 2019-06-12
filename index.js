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

// Socket connection
io.on('connection', (socket) => {
	console.log('Made socket connection', socket.id);

	//Chat Event
	//	When the server recieves a message from a socket
	socket.on('chat', (data) => {
		io.sockets.emit('chat', data);

		let today = new Date();

		let today_str = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + " at " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

		console.log(today_str);
		console.log(data.handle + " (" + socket.id + ") : " + data.message);
		console.log('\n');
	});

	//Typing event
	//	When the client is typing
	socket.on('typing', (data) => {
		socket.broadcast.emit('typing', data);
	});
});