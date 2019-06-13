var port = 4000;
var host = "http://localhost:" + port;

//Make Connection
var socket = io.connect();

//Query DOM
var editxtMessage = document.getElementById('message');
var editxtUsername = document.getElementById('username');
var btnSend = document.getElementById('send');
var boxOutput = document.getElementById('output');
var boxFeedBack = document.getElementById('feedback');

function sendMessage() {
	if(editxtMessage.value == "") return;
	socket.emit('chat', {
		message: editxtMessage.value,
		username: editxtUsername.value
	});

	var newMsg = document.createElement('p');
	newMsg.innerHTML = '<span class="username-me">' + editxtUsername.value + ' :</span> ' + editxtMessage.value;
	boxFeedBack.innerHTML = "";
	boxOutput.appendChild(newMsg);

	editxtMessage.value = "";
}

//Emit Events
btnSend.addEventListener('click', sendMessage);

editxtMessage.onkeypress = (e) => {
	if(e.code == "Enter") {
		sendMessage();
	}
};

editxtMessage.addEventListener('keypress', () => {
	socket.emit('typing', editxtUsername.value);
});

// Listen for events
socket.on('chat', (data) => {
	var newMsg = document.createElement('p');
	newMsg.innerHTML = '<span class="username-them">' + data.username + ' :</span> ' + data.message;
	boxFeedBack.innerHTML = "";
	boxOutput.appendChild(newMsg);
});

socket.on('typing', (data) => {
	boxFeedBack.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});

socket.on('update-stat', (data) => {
	document.getElementById('num-connected').innerText = data.numConnected + " Connected";
});

socket.on('user-disconnect', (data) => {
	var newMsg = document.createElement('p');
	newMsg.innerHTML = '<span class="username-them">' + data + '</span> is now disconnected.';
	newMsg.className += "err-msg ";
	boxFeedBack.innerHTML = "";
	boxOutput.appendChild(newMsg);
});