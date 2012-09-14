(function(exports) {
	var FtpIndex = function() {
		var self 		= this,
			socket		= io.connect('http://inpost.kr:1340'),
			ftpList		= new FtpList(),
			ftpInfo		= null,
			ui_args 	= { wftp: this, socket: socket },
			temp_doc	= "";
		
		
		//-- Public Methods
		//
		
		self.connect = function(fInfo) {
			ftpInfo	 = (!fInfo) ? ftpInfo : fInfo;
			
			var def_args = _.extend({ 
				type: "auth",
				p_size: FtpFile.packetSize
			}, ftpInfo); 
			
			// 인증 메시지 전송
			socket.emit("auth", def_args);
		}
		
		self.getFtpList = function() {
			return ftpList;
		}
		
		self.getFtpInfo = function() {
			return ftpInfo;
		}
		
		self.setTempDoc = function(ext, data) {
			temp_doc = {
				ext: ext,
				data: data
			};
		}
		
		self.getTempDoc = function() {
			return temp_doc;
		}
		
		
		//-- Socket Listeners
		//
		
		socket.on("auth", function(args) {
			if(args.result == "success") {
				self.body.changePath("/");
				self.body.left.initDir();
				
				alert("FTP 서버의 연결이 성공하였습니다.");
			} else {
				alert("FTP 서버의 연결이 실패하였습니다.");
			}
		});
		
		socket.on("total_cnt", function(total_cnt) {
			self.footer.bind.total_cnt(total_cnt);
		});
		
		socket.on("disconnect", function() {
			alert("웹 서버의 연결이 끊겼습니다.");
		});
		
		
		//-- Private Methods
		//
		
		function alert(msg) {
			self.popup.alertShow(msg);
		}
		
		
		//-- Public Property
		//
		
		self.upload 	= new FtpUIUpload(_.extend({ id: "uploadWrap" }, ui_args));
		self.download 	= new FtpUIDownload(_.extend({ id: "downloadWrap" }, ui_args));
		self.popup 		= new FtpUIPopup(_.extend({ id: "popupWrap" }, ui_args));
		self.top 		= new FtpUITop(_.extend({ id: "topWrap" }, ui_args));
		self.body 		= new FtpUIBody(_.extend({ id: "bodyWrap" }, ui_args));
		self.footer		= new FtpUIFooter(_.extend({ id: "footerWrap" }, ui_args));
		self.menu		= new FtpUIMenu(_.extend({ id: "menuWrap" }, ui_args));
		
		
		//--
		alert("<p class='msg'>'wFTP 테스트' 서버는 한글 파일을 지원하지 않습니다.</p><p class='msg_info'>사용시 문제가 될 수 있으니 자제 부탁드립니다.</p>");
	}
	
	exports.FtpIndex = FtpIndex;
})(window);