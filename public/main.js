var port = 4000;
var host = "http://localhost:" + port;

//Make Connection
var socket = io.connect();

//Query DOM
var editxtMessage = document.getElementById('message');
var editxtUsername = document.getElementById('handle');
var btnSend = document.getElementById('send');
var boxOutput = document.getElementById('output');
var boxFeedBack = document.getElementById('feedback');

//Emit Events
btnSend.addEventListener('click', () => {
	socket.emit('chat', {
		message: editxtMessage.value,
		handle: editxtUsername.value
	});
});

editxtMessage.addEventListener('keypress', () => {
	socket.emit('typing', editxtUsername.value);
});

// Listen for events
socket.on('chat', (data) => {
	var newMsg = document.createElement('p');
	newMsg.innerHTML = '<strong>' + data.handle + ' :</strong> ' + data.message;
	boxFeedBack.innerHTML = "";
	boxOutput.appendChild(newMsg);
});

socket.on('typing', (data) => {
	boxFeedBack.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});