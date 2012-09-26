var fs = require("fs"),
	path = require("path"),
	rimraf = require("rimraf");
	
var FTPManager = require("./wftp");

module.exports = function(pool, socket) {
	var ftpm = null, self = this;
	var path = "./temp/" + socket.id;
	
	//-- socket 디렉토리 생성
	fs.mkdir(path, function(err) {
		if(err) pool.printLog("user", err);
	});

	//-- Socket Listener
	//
	socket.on('auth', function(args) {
		// FTP서버에 새로 연결
        ftpm = new FTPManager(pool, socket, args);
        
        ftpm.auth(function(err) {
        	var res = "success";
        	
			if(err) {
				res = "fail";
				ftpmClose();
			}
			
			socket.emit("auth", { result: res });
		});
	});
	
	socket.on('upload', function(args) {
		if(ftpm != null) ftpm.message('upload', args);
    });

	socket.on('download', function(args) {
		if(ftpm != null) ftpm.message('download', args);
    });

	socket.on('d_download', function(args) {
		if(ftpm != null) ftpm.message('d_download', args);
    });

	socket.on('list', function(args) {
		if(ftpm != null) ftpm.message('list', args);
    });

	socket.on('rename', function(args) {
		if(ftpm != null) ftpm.message('rename', args);
    });

	socket.on('rmdir', function(args) {
		if(ftpm != null) ftpm.message('rmdir', args);
    });
    
	socket.on('mkdir', function(args) {
		if(ftpm != null) ftpm.message('mkdir', args);
    });
	
	socket.on('delete', function(args) {
		if(ftpm != null) ftpm.message('delete', args);
    });

	socket.on('read', function(args) {
		if(ftpm != null) ftpm.message('read', args);
    });

    socket.on('disconnect', function() {
    	pool.delUser(self);
		if(ftpm != null) ftpmClose();
	});
	
	
	//-- Public Methods
	//
	this.getId = function() {
		return socket.id;
	}
	
	this.getSocket = function() {
		return socket;
	}
	    
    
    //-- Private Methods
    //
    function ftpmClose() {
    	ftpm.end();
		ftpm = null;
		
		rimraf(path, function(err) {
    		if(err) pool.printLog("user", err);
    	});
    }
}