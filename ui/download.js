(function(exports) {
	var FtpUIDownList = function(opts) {
		vo.applyTo(this, opts.id);
		
		var	self		= this,
			ready		= false,
			main		= opts.main;
			
		var ftpFile		= null,
			ftpBlobList = [];
		
		self.downlist 	= [];	// 받게될 파일 리스트
		
		//-- Private Methods
		//
		
		function resetDownFiles() {
			self.downlist = [];
			
			ready = false;
		}
		
		function updateMainInfo() {
			var totalSize = 0;
			
			for(var i in self.downlist) {
				totalSize += parseInt(self.downlist[i].size);
			}
			
			main.bind.totalCnt(self.downlist.length);
			main.bind.totalSize(FtpFile.getSizeStr(totalSize));
			
			main.bind.downPercent("0%");
			main.bind.barPercent(0);
			
			main.bind.currTime(0);
			main.bind.currCnt(0);
			main.bind.currSize(0);
			
		}
		
		function alert(msg) {
			main.wftp.popup.alertShow(msg);
		}
			
		//-- Public Methods
		//
		
		self.addDownFiles = function(c_items) {
			resetDownFiles();	// 리셋
			
			for(var i in c_items) { 
				var file = c_items[i];
				
				if(file != null && !file.is_dir) {
					file.index = self.downlist.length;
					self.downlist.push(file);
				}
			}
			
			self.tpl.tpl_downlist({ items: self.downlist });
			if(self.downlist.length > 0) { 
				$(main.tag.transfer).removeClass("disable");
			}
			
			updateMainInfo();	// 메인 파일정보 UI 변경
		}
		
		self.getOverFiles = function() {
			var overFiles = [];
			
			for(var i in self.downlist) {
				if(self.downlist[i].size > (FtpFile.fileDownMaxSize * 1024 * 1024)) {
					overFiles.push(self.downlist[i]);
				} 
			}
			
			return overFiles;
		}
		
		self.getDownInfo = function(callback) {
			var packetTotCount = 0,
				packetTotSize = 0;
			
			for(var i in self.downlist) {
				var ftpFile = self.downlist[i];
				
				packetTotCount += ftpFile.getPacketCount();
				packetTotSize += parseInt(ftpFile.size);
			}
			
			return {
				pTotCount: packetTotCount,
				pTotSize: packetTotSize
			};
		}
		
		
		//-- Event Definition
		//
		
		self.act.fileDelete = function(e, i) {
			if(self.downlist.length == 1) {
				alert("다운로드 파일을 더이상 삭제할 수 없습니다.");
			} else {
				for(var j in self.downlist) {
					if(i == self.downlist[j].index) {
						self.downlist.splice(j, 1); 
						self.tpl.tpl_downlist({ items: self.downlist });
					}
				}
				
				if(self.downlist.length < 1) { 
					$(main.tag.transfer).addClass("disable");
				}
				
				updateMainInfo();	// 메인 파일정보 UI 변경
			}
			
			e.stopPropagation();
		}
	};
	
	var FtpUIDownload = function(opts) {
		vo.applyTo(this, opts.id);

		var	self		= this,
			path		= "",
			socket 		= opts.socket,
			timer		= new FtpTimer(),
			process		= null;
					
		var downlist = new FtpUIDownList({ id: "downlist", main: self });			
			
			
		//-- Private Methods
		//
		
		function init() {
			// UI, 드래그 적용
			$(self.root).draggable({ handle: "h3" });
			
			//
			self.wftp = opts.wftp;
		}
		
		function addUploadFiles(files) {
			var fileList = FtpFile.getFileList(files, path);
			downlist.addUploadFiles(fileList);
		}
		
		function downloadFile(index) {
			var ftpFile = downlist.downlist[index];
			
			// 타이머 시작
			if(index == 0) {
				timer.run(function(sec) {
					self.bind.currTime(sec);
				});
				
				var info = downlist.getDownInfo();
				process = new FtpProcess(info.pTotCount, info.pTotSize);
				
				$(self.tag.transfer).addClass("disable");
			}
			
			socket.emit("download", { path: path, fileName: ftpFile.name, fileIndex: index, order: "start" });
		}
		
		function setProcessUI(percent) {
			// 진행바 변경
			self.bind.downPercent(percent);
			self.bind.barPercent(percent);
		}
		
		function alert(msg) {
			self.wftp.popup.alertShow(msg);
		}
		
		
		//-- Public Methods
		//
		
		self.show = function(downFiles) {
			// UI 변경
			self.bind.folderName(path);
			
			// 화면 중간에 위치
			$(self.root).css({ left: "50%", top: "50%" }).show();
			
			// 디렉토리 체크
			var dirCount = 0;
			for(var i in downFiles) {
				var file = downFiles[i];
				if(file != null && downFiles[i].is_dir) dirCount++;
			}
			if(dirCount > 0) alert("디렉토리는 다운로드 받을 수 없습니다,");
			
			downlist.addDownFiles(downFiles);
		}
		
		self.setPath = function(tmp_path) {
			path = tmp_path;
		}
		
		
		//-- Event Definition
		//
		
		self.act.downFiles = function(e) {
			if(!$(e.target).hasClass("disable")) {
				var overFiles = downlist.getOverFiles();
				
				if(overFiles.length > 0) {
					var len = overFiles.length,
						msg = "<p class='msg_info'>파일 한 개당 최대 크기는 " + FtpFile.fileDownMaxSize  + "MB입니다.</p>";
					
					if(len == 1) alert("<p class='msg'><span>'" + overFiles[0].name + "' 파일의 용량이 너무 큽니다.</span></p>" + msg);
					else 		 alert("<p class='msg'><span>'" + overFiles[0].name + "' 외 " + (len - 1) + "개 파일의 용량이 너무 큽니다.</span></p>" + msg);
				} else {
					downloadFile(0);
				}
	        }
		}
		
		self.act.close = function(e) {
			$(self.root).hide();
		}


		//-- Socket 메시징 처리 
		//
		socket.on("download", function(data) {
			var args = { fileIndex: data.fileIndex, blobIndex: data.blobIndex + 1, order: "ing" };
			
            //-- Start
        	if(data.order == "start") {
	            ftpFile = downlist.downlist[data.fileIndex];
	            ftpBlobList = [];
	            
        		downlist.bind.fileWait(data.fileIndex, "<span class='upload_progress'>처리 중</span>");
        		$(downlist.tag.fileDelBut[data.fileIndex]).hide();
	    		
	    		//	
	    		socket.emit("download", args);
        	} 
        	
        	//-- ING
        	if(data.order == "ing") {
        		// UI
    			process.run(function(size, percent) {
	    			ftpBlobList[data.blobIndex] = data.data;
	    			
	    			self.bind.currSize(size);
	    			setProcessUI(percent);
	    			
	    			downlist.bind.fileDown(data.fileIndex, ftpFile.sendPacket());
	    			
	    			//-- End
		    		if(data.blobIndex == data.blobSize - 1) {
		        		var downData = ftpBlobList.join(""),
		        			downLink = "<span class='upload_complete'>" + _.downLink(ftpFile.name, downData, "다운로드") + "</span>";
		        		
		        		downlist.bind.fileWait(data.fileIndex, downLink);
		    			self.bind.currCnt(data.fileIndex + 1);
		        		
		        		// 다음 파일 전송
				        if(data.fileIndex < downlist.downlist.length - 1) {
				        	downloadFile(data.fileIndex + 1);
				        }
				        
				        // 모든 파일이 다운로드 되었을 경우,
		        		if(data.fileIndex == downlist.downlist.length - 1) {
		        			// 전송시간 종료
							timer.reset();
							
							// 진행바 100%로 변경
							setProcessUI("100%");
		        		}
		    		} else {
		    			socket.emit("download", args);
		    		}
	    		});
    		}
		});
		
		
		//-- 초기화 메소드 호출
		init();
	}
	
	exports.FtpUIDownload = FtpUIDownload;
})(window);