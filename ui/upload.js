(function(exports) {
	var FtpUIFileCheck = function(opts) {
		_.extend(this, new MvvmUI(opts.id));
		
		var	self			= this,
			isCkAll			= false,
			duplList		= [];
		
		var ui_uplist		= opts.ui_uplist;
		
		//-- Private Methods
		//
		
		function showUploadCheck(type) {
			if(duplList.length > 0) { 
				var item = duplList.shift();
				
				if(!isCkAll) {
					self.tpl.tpl_dupl(item);
					$(self.tag.dupl).show();
				} else {
					switch(type) {
						case "overwrite" :
							self.act.btnOverWrite(null, item.fileIndex);
							break;

						case "pass" :
							self.act.btnPass(null, item.fileIndex);
							break;
					}
				}
			} else { 
				// 모든 중복 파일 체크 완료 시...
				$(self.tag.dupl).hide();
				self.uploadEndProc();
				
				// 체크 해제
				$(self.tag.checkall).attr("checked", false);
				isCkAll = false;
			}
		}
				
		//-- Public Methods	
		//
			
		self.uploadEndProc = null; // 파일 체크 완료 시, 호출할 콜백 함수
		
		self.uploadPreCheck = function(cklist, callback) {
			var uplist 		= ui_uplist.uplist;
			self.uploadEndProc = callback;
				
			for(var i in uplist) {
				for(var j in cklist) {
					if(uplist[i].name == cklist[j].name) {
						duplList.push({
							fileIndex: i,
							fileName: uplist[i].name,
							fileOldDate: cklist[j].date,
							fileOldSize: cklist[j].u_size,
							fileNewDate: uplist[i].date,
							fileNewSize: uplist[i].u_size
						});
					}
				}
			}
			
			showUploadCheck();
		}
		
		//-- Event Definition
		//
		
		self.act.checkAll = function(e, i) {
			isCkAll = !isCkAll;
		}
		
		self.act.btnOverWrite = function(e, i) {
			showUploadCheck("overwrite");
		}
		
		self.act.btnPass = function(e, i) {
			ui_uplist.delUploadFile(i);
			showUploadCheck("pass");
		}
		
		self.act.btnChangeName = function(e, i) {
			var file = ui_uplist.uplist[i];
			self.tpl.tpl_rename({ fileIndex: i, fileName: file.name });

			$(self.tag.dupl).hide();
			$(self.tag.rename).show();
		}
		
		self.act.btnStopUpload = function(e, i) {
			$(self.tag.dupl).hide();
		}
		
		// 이름변경 UI, OK 버튼 클릭
		self.act.btnChangeNameOk = function(e, i) {
			var name = $(self.tag.rename_txt).val();
			
			ui_uplist.uplist[i].name = name;
			ui_uplist.tpl.tpl_uplist({ items: ui_uplist.uplist });
			
			showUploadCheck();
			$(self.tag.rename).hide();
		}
		
		// 이름변경 UI, Cacel 버튼 클릭
		self.act.btnChangeNameCancel = function(e, i) {
			showUploadCheck();
			$(self.tag.rename).hide();
		}
	}
	
	var FtpUIUploadList = function(opts) {
		_.extend(this, new MvvmUI(opts.id));
		
		var	self			= this,
			m_tag			= opts.ui_main.tag,
			m_bind			= opts.ui_main.bind;
		
		self.uplist		 	= [];
		self.sendFileList 	= [];	// 전송될 파일 리스트
		
		//-- Private Methods
		//
		
		function resetUploadFiles() {
			self.uplist		 	= [];
			self.sendFileList 	= [];	// 전송될 파일 리스트
		}
		
		function updateMainInfo() {
			var totalSize = 0;
			
			for(var i in self.uplist) {
				totalSize += self.uplist[i].size;
			}
			
			m_bind.totalCnt(self.uplist.length);
			m_bind.totalSize(FtpFile.getSizeStr(totalSize));
			
			m_bind.sendPercent("0%");
			m_bind.barPercent(0);
			
			m_bind.currTime(0);
			m_bind.currCnt(0);
			m_bind.currSize(0);
			
		}
			
		//-- Public Methods
		//
		
		self.addUploadFiles = function(fileList) {
			resetUploadFiles();	// 리셋
			
			for(var i in fileList) { 
				var file = fileList[i];
				file.index = self.uplist.length;
				
				self.uplist.push(file);
			}
			self.tpl.tpl_uplist({ items: self.uplist });
			
			if(self.uplist.length > 0) { 
				$(m_tag.holder).hide();
				$(m_tag.transfer).removeClass("disable");
			}
			
			updateMainInfo();	// 메인 파일정보 UI 변경
		}
		
		self.delUploadFile = function(i) {
			for(var j in self.uplist) {
				if(i == self.uplist[j].index) {
					self.uplist.splice(j, 1); 
					self.tpl.tpl_uplist({ items: self.uplist });
				}
			}
			
			if(self.uplist.length < 1) { 
				$(m_tag.holder).show();	
				$(m_tag.transfer).addClass("disable");
			}
			
			updateMainInfo();	// 메인 파일정보 UI 변경
		}
		
		self.sendUploadFiles = function(callback) {
			var count = 0,
				packetTotCount = 0,
				packetTotSize = 0;
			
			for(var i in self.uplist) {
				(function(index) {
					self.uplist[index].setPacketList(function(pList) {
						self.sendFileList.push({
							ftpFile: self.uplist[index],
							packetList: pList
						});
						
						count++;
						
						packetTotCount += pList.length;
						packetTotSize += self.uplist[index].size;
						
						// 모든 파일이 로드가 되었다면...
						if(self.uplist.length == count) {
							callback(packetTotCount, packetTotSize);
						}
					});
				})(i);
			}
		}
		
		self.getOverFiles = function() {
			var overFiles = [];
			
			for(var i in self.uplist) {
				if(self.uplist[i].size > (FtpFile.fileMaxSize * 1024 * 1024)) {
					overFiles.push(self.uplist[i]);
				} 
			}
			
			return overFiles;
		}
		
		//-- Event Definition
		//
		
		self.act.fileDelete = function(e, i) {
			self.delUploadFile(i);
		}
	};
	
	var FtpUIUpload = function(opts) {
		_.extend(this, new MvvmUI(opts.id));

		var	self		= this,
			wftp		= opts.wftp;
			path		= "",
			socket 		= opts.socket,
			timer		= new FtpTimer(),
			process		= null;
					
		var ui_uplist = new FtpUIUploadList({ id: "uplist", ui_main: self }),
			ui_fileck = new FtpUIFileCheck({ id: "fileck", ui_uplist: ui_uplist });
			
			
		//-- Private Methods
		//
		
		function init() {
			// UI, 업로드 디렉토리
			self.bind.fileMaxSize(FtpFile.fileMaxSize);
			
			// UI, 드래그 적용
			$(self.root).draggable({ handle: "h3" });
			
			// FF일 경우, 파일추가 버튼 위치 변경
			if($.browser.mozilla) {
				$(self.tag.selfiles).css("right", 0);
			}
		}
		
		function addUploadFiles(files) {
			var fileList = FtpFile.getFileList(files, path);
			ui_uplist.addUploadFiles(fileList);
		}
		
		function onSendFile(index) {
			var file = ui_uplist.sendFileList[index].ftpFile;
			var args = { path: path, fileName: file.name, fileIndex: index };

			socket.emit("upload", $.extend(args, { order: "start" }));
	        
	        // 파일 블롭 전송
			onSendFileBlob(index, 0);
		}
		
		function onSendFileBlob(fileIndex, blobIndex) {
			var obj = ui_uplist.sendFileList[fileIndex];
			var args = { path: path, fileName: obj.ftpFile.name, fileIndex: fileIndex };
			
			if(obj.packetList[blobIndex]) {
				socket.emit("upload", $.extend(args, { fileBlob: obj.packetList[blobIndex], blobIndex: blobIndex, order: "ing" }));
			}
	        
	        if(blobIndex == obj.packetList.length - 1) {
				socket.emit("upload", $.extend(args, { order: "end" }));
			}
		}
		
		function setProcessUI(percent) {
			// 진행바 변경
			self.bind.sendPercent(percent);
			self.bind.barPercent(percent);
		}
		
		function alert(msg) {
			wftp.popup.alertShow(msg);
		}
		
		
		//-- Public Methods
		//
		
		self.show = function() {
			if(path == "") {
				alert("FTP 서버에 연결되지 않았습니다.");
				return;
			}
			
			// UI 변경
			self.bind.folderName(path);
			
			// 화면 중간에 위치
			$(self.root).css({ left: "50%", top: "50%" }).show();
		}
		
		self.setPath = function(tmp_path) {
			path = tmp_path;
		}
		
		
		//-- Event Definition
		//
		
		self.act.sendFiles = function(e) {
			if(!$(e.target).hasClass("disable")) {
				var overFiles = ui_uplist.getOverFiles();
				
				if(overFiles.length > 0) {
					var len = overFiles.length;
					
					if(len == 1) alert("'" + overFiles[0].name + "' 파일의 용량이 너무 큽니다.");
					else 		 alert("'" + overFiles[0].name + "' 외 " + (len - 1) + "개 파일의 용량이 너무 큽니다.");
				} else {
					// 파일 전송 대상 폴더의 파일 목록 가져오기
					socket.emit("upload", { order: "check", nodeType: 0, path: path });
				}
	        }
		}
		
		self.act.selectedFiles = function(e) {
			addUploadFiles(e.target.files);
		}
		
		self.act.close = function(e) {
			$(self.root).hide();
		}
		
		//-- Tag Event Definition
		//
		
		self.tag.holder.ondrop = function(e) {
			e.preventDefault();
			addUploadFiles(e.dataTransfer.files);
		}
		
		self.tag.holder.ondragover = function() { return false; }
		self.tag.holder.ondragend = function() { return false; }


		//-- Socket 메시징 처리 
		//
		socket.on("upload", function(data) {
    		if(data.order == 'check') {
    			var cklist = FtpFile.getFileList(data.nodeList, path);
    			
    			// 중복 파일 체크 후, 전송 시작
        		ui_fileck.uploadPreCheck(cklist, function() {
        			ui_uplist.sendUploadFiles(function(pTotCount, pTotSize) {
						process = new FtpProcess(pTotCount, pTotSize);

        				//-- UI
        				$(self.tag.transfer).addClass("disable");
        				
						timer.run(function(sec) {
							self.bind.currTime(sec);
						});
						
        				onSendFile(0);
        			});
        		});
    		} else {
	            
            	if(data.order == 'start') {
            		// UI
            		ui_uplist.bind.fileWait(data.fileIndex, "<span class='upload_progress'>처리 중</span>");
            		$(ui_uplist.tag.fileDelBut(data.fileIndex)).hide();
            		
            	} else if(data.order == 'ing') {
            		// 블롭 전송 재귀함수 호출
            		onSendFileBlob(data.fileIndex, data.blobIndex + 1);
            		
            		// UI, 진행률
            		process.run(function(size, percent) {
						var ftpFile = ui_uplist.sendFileList[data.fileIndex].ftpFile;
            			
            			self.bind.currSize(size);
            			setProcessUI(percent);
            			
            			ui_uplist.bind.fileDown(data.fileIndex, ftpFile.sendPacket());
            		});
            		
            	} else if(data.order == 'end') {
            		ui_uplist.bind.fileWait(data.fileIndex, "<span class='upload_complete'>완료</span>");
        			self.bind.currCnt(data.fileIndex + 1);
            		
            		// 다음 파일 전송
			        if(data.fileIndex < ui_uplist.sendFileList.length - 1) {
			        	onSendFile(data.fileIndex + 1);
			        }
			        
			        // 모든 파일이 업로드 되었을 경우,
            		if(data.fileIndex == ui_uplist.sendFileList.length - 1) {
            			// 파일 목록 갱신
						wftp.body.changePath(path);
            			
            			// 전송시간 종료
						timer.reset();
						
						// 진행바 100%로 변경
						setProcessUI("100%");
						
						// 모두 업로드 완료시 닫기
						if($(self.tag.closeComplete).attr("checked") == "checked") {
							self.act.close();
						}
            		}
            	}
        	}
		});
		
		init();
	}
	
	exports.FtpUIUpload = FtpUIUpload;
})(window);