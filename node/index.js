process.on('uncaughtException', function (err) {
	console.log('Caught exception: ' + err);
});

var _ = require("underscore"),
	io = require('socket.io').listen(1340);

var FTPPool = require("./pool");
var FTPUser = require("./user");

// ftp pool
var pool = new FTPPool();

io.set('log level', 0);

io.sockets.on('connection', function(socket) {
	var user = new FTPUser(pool, socket);
	pool.addUser(user);
});