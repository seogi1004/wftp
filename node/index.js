var FTPManager = require("./wftp"),
	Http = require('http'),
	_ = require("underscore"),
	io = require('socket.io').listen(1340);

// Socket IO 설정
io.set('log level', 0);

// 현재 클라이언트 접속자 수
var total_cnt = 0;

io.sockets.on('connection', function(socket) {
	var ftpm = null;

	// 전체 접속자 증가
	total_cnt += 1;
	socket.broadcast.emit("total_cnt", total_cnt);
	socket.emit("total_cnt", total_cnt);
	
	socket.on('auth', function(args) {
		// 기존의 연결은 종료
		if(ftpm) ftpmClose();
		
		// FTP서버에 새로 연결
        ftpm = new FTPManager(socket, args);
        ftpm.auth(function(err) {
        	var res = "success";
        	
			if(err) {
				res = "fail";
				ftpmClose();
			}
			
			socket.emit("auth", { result: res });
			
			// 사용자 인증 로그
			console.log("[" + res + "] - " + JSON.stringify(args));
		});
	});
	
	socket.on('upload', function(args) {
		if(ftpm != null) ftpm.message('upload', args);
    });

	socket.on('download', function(args) {
		if(ftpm != null) ftpm.message('download', args);
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

    socket.on('disconnect', function(){
    	// 전체 접속자 감소
    	total_cnt = total_cnt > 0 ? total_cnt - 1 : 0;
		socket.broadcast.emit("total_cnt", total_cnt);
		socket.emit("total_cnt", total_cnt);
		
		ftpmClose();
	});
    
    function ftpmClose() {
    	if(ftpm != null) { 
	    	ftpm.end();
			ftpm = null;
		}
    }
});