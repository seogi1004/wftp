(function(exports) {
	var FtpUIBody = function(opts) {
		vo.applyTo(this, opts.id);

		var self 			= this,
			wftp			= opts.wftp,
			socket 			= opts.socket;
							
		var root 			= this.root,
			bind 			= this.bind,
			tag  			= this.tag;
			
		var	items			= null,			// 임시저장, 파일 목록
			c_items			= null,			// 체크된 아이템들
			p_path			= null,			// 임시저장, 부모 경로
			path			= "/";			// 현재 경로
			
		var d_path			= "/";			// 최초 파일삭제 패스
			isDelMode 		= false,
			delFileList 	= [],			// 파일삭제 목록
			delDirList 		= [],			// 파일삭제 체크를 위한 디렉토리 목록
			delDirPathList 	= [];			// 디렉토리삭제 목록
			
		var initHeight		= 0;			// 최초 wftp 높이값
			

		//-- Public Methods
		
		self.changePath = function(p) {
			path = p;
			
			//--
			socket.emit("list", { path: path, nodeType: -1 });
		}
		self.changeName = function(name, rename) {
			var ftpFile = self.getFtpFile(name),
				b_f_path = ftpFile.f_path;
			
			ftpFile.setFullPath(rename);
			var a_f_path = ftpFile.f_path;
			
			// 디렉토리일 경우, 좌측메뉴 갱신
			if(ftpFile.is_dir) { 
				self.left.deleteDir(b_f_path);
			}
			
			socket.emit("rename", { fromPath: b_f_path, toPath: a_f_path });
		}
		
		self.getStatus = function() {
			if(items != null) {
				return {
					items: items,
					p_path: p_path,
					path: path
				};
			}
			
			return null;
		}
		
		self.deleteFtpFile = function(name) {
			for(var i in items) {
				if(items[i].name == name) {
					items.splice(i, 1);
				}
			}
		}
		
		self.getFtpFile = function(name) {
			if(items != null) {
				for(var i in items) {
					if(items[i].name == name) {
						return items[i];
					}
				}
			}
			
			return null;
		}
		
		self.getFtpFileIndex = function(index) {
			if(items[index]) {
				return items[index];
			}
			
			return null;
		}

		self.checkedItem = function(index, isChecked) {
			if(isChecked) {
				c_items[index] = items[index];
			} else {
				c_items[index] = null;
			}
			
		}
		
		self.isCheckedItem = function() {
			var result = false;
			
			for(var i in c_items) {
				if(c_items[i] != null) { 
					result = true;
				}
			}
			
			return result;
		}
		
		self.deleteItem = function() {
			if(!isDelMode) { 
				isDelMode = true;
				d_path = path;
			}
			
			for(var i in c_items) {
				var item = c_items[i];
				
				if(item != null) {
					if(item.is_dir) delDirList.push(item);
					else delFileList.push(item);
					
					c_items[i] = null;
				}
			}
			
			nextDelete();
		}
		
		self.createDir = function(dirName) {
			var dirPath = path + "/" + dirName;
			if(path == "/") dirPath = path + dirName;
			
			socket.emit("mkdir", { path: dirPath });
		}
		
		self.readItem = function(name) {
			var item = self.getFtpFile(name);
			
			if(item.is_syn || item.t_ext == "img") {
				socket.emit("read", { 
					name: name,
					path: item.f_path, 
					ext: item.ext, 
					is_img: (item.t_ext == "img") ? "Y" : "N", 
					is_syn: (item.is_syn) ? "Y" : "N"
				});
			}
		}

		self.viewThumbs = function(items) {
			for(var i in items) {
				var item = items[i];
				
				if(!item.is_dir && item.t_ext == "img" && item.size <= 100000) { // 용량 제한 100kb
					socket.emit("thumb", { 
						index: i,
						path: item.f_path
					});
				}
			}
		}
		
		self.checkedDown = function() {
			var c_count = 0;
			
			for(var i in c_items) {
				if(c_items != null) c_count++;
			}
				
			if(c_count == 0) alert("파일을 한개 이상 선택해주세요.");
			else wftp.download.show(c_items);
		}
		
		self.setItems = function(t_items) {
			items = t_items;
		}
		
		self.resizeView = function() {
			//-- 전체 높이 조정
			var h1 = $(self.main.filelist.tag.viewRoot).height() + 100,
				h2 = $("#dirRoot").height() + 100;
			var h  = (h1 > h2) ? h1 : h2;
				
			if(h > initHeight) {
				$(root).height(h + 200);
			} else {
				$(root).height(initHeight);
			}
		}
		
		self.contextMenu = function(name, type) {
			var ftpInfo = wftp.getFtpInfo(),
				ftpFile = self.getFtpFile(name),
				isLink	= (ftpInfo.url != "") ? true : false;
			
			switch(type) {
				case "d_down":
					if(ftpFile.size > (FtpFile.fileUpMaxSize * 1024 * 1024)) {
						var msg = "<p class='msg_info'>파일 한 개당 최대 크기는 " + FtpFile.fileUpMaxSize  + "MB입니다.</p>";
						alert("<p class='msg'><span>'" + ftpFile.name + "' 파일의 용량이 너무 큽니다.</span></p>" + msg);
					} else {
						wftp.popup.donwloadShow(path, ftpFile.name); 
					}
					
					break;
					
				case "l_down":
					if(isLink) window.open("http://" + ftpInfo.url + ftpFile.f_path);
					else alert("Ftp Url을 설정하지 않았습니다."); break;

				case "l_show":
					if(isLink) wftp.popup.linkStrShow(ftpFile.name);
					else alert("Ftp Url을 설정하지 않았습니다.");
					
					break;
				
				case "rename":
					wftp.popup.confirmShow("이름변경하기", ftpFile.name, function(rename) {
						if(rename == "") alert("파일명을 입력해주세요.");
						else if(ftpFile.name == rename) alert("파일명을 변경해주세요.");
						else self.changeName(name, rename);
					}); break;
					
				case "delete":
					wftp.popup.delShow(); break;
					
				case "preview":
					if(ftpFile.is_syn || ftpFile.t_ext == "img") self.readItem(ftpFile.name);
					else alert("미리보기를 지원하지 않는 파일입니다."); break;
					
				case "join":
					self.changePath(ftpFile.f_path); break;
			}
		}
		
		
		//-- Socket Listeners
		//
		
		socket.on("list", function(args) {
			if(args.isError) {
				alert("파일 조회 오류입니다. 잠시 후에 다시 시도해주세요.");
				return;
			}
			
			var fileList = [],
				tmpList = FtpFile.getFileList(args.nodeList, path);
				
			// 부모 패스 설정
			p_path = getParentPath();
				
			for(var i in tmpList) {
				if(tmpList[i].is_dir) {
					fileList.push(tmpList[i]);
				}
			}
			
			for(var i in tmpList) {
				if(!tmpList[i].is_dir) {
					fileList.push(tmpList[i]);
				}
			}
			
			// 임시저장 파일 세팅, 체크파일 목록 초기화
			c_items = new Object();
			items = fileList;
			
			// main, 파일 목록 UI 갱신
			self.wftp.upload.setPath(path);
			self.wftp.download.setPath(path);
			self.main.changePath(items, path, p_path);
			
			// left, 폴더 목록 UI 갱신
			self.left.updateDir();
			
			// 삭제 모드일 경우,
			if(isDelMode) {
				self.main.toolbar.act.allChecked();
				self.deleteItem();
			}
		});
		
		socket.on("delete", function(args) {
			if(args.isError) {
				alert("파일 삭제 오류입니다. 잠시 후에 다시 시도해주세요.");
				self.changePath(d_path);
				return;
			} 
			
			self.main.changePath(items, path, p_path);
			nextDelete();
		});

		socket.on("rmdir", function(args) {
			if(args.isError) {
				alert("폴더 삭제 오류입니다. 잠시 후에 다시 시도해주세요.");
				self.changePath(d_path);
				return;
			}
			
			nextDeleteDir();
		});

		socket.on("mkdir", function(args) {
			if(args.isError) {
				alert("동일한 폴더 이름이 존재합니다.");
				return;
			}
			
			self.changePath(path);
		});

		socket.on("read", function(args) {
			if(args.isError) {
				alert("파일 읽기 오류입니다. 잠시 후에 다시 시도해주세요.");
				return;
			}
			
			if(args.is_img == "Y") {
				wftp.popup.imgShow(args.data, args.name, args.ext);
			} else if(args.is_syn == "Y") {
				var ftpInfo = wftp.getFtpInfo(),
					fullPath = (path == "/") ? (path + args.name) : (path + "/" + args.name);
				
				$("input[name=mode]").val(args.ext);
				$("input[name=code]").val(Base64.decode(args.data));
				$("input[name=path]").val(fullPath);
				$("input[name=d_path]").val(ftpInfo.d_path);
				$("input[name=host]").val(ftpInfo.host);
				$("input[name=passwd]").val(ftpInfo.passwd);
				$("input[name=user]").val(ftpInfo.user);
				$("form[name=frm]").submit();
				
				//wftp.setTempDoc(args.ext, Base64.decode(args.data));
				//wftp.popup.docShow(args.data, args.name);
			}
		});

		socket.on("thumb", function(args) {
			if(args.isError) return;
			
			var blobImg = "data:image/" + args.ext + ";base64," + args.data,
				bind = self.main.filelist.bind;
			
			bind.thumb(args.index, blobImg);
			setTimeout(function() { 
				var img = bind.get("thumb")[args.index];
				
				_.imgResize(img, {
					maxWidth: 100,
					maxHeight: 80,
					ieWidth: 100,
					ieHeight: 80
				});
				
				img.style.display = "";
			}, 100);
		});
		
		socket.on("rename", function(args) {
			if(args.isError) {
				alert("동일한 파일/폴더 이름이 존재합니다.");
			} else {
				self.main.changePath(items, path, p_path);
			}
		});
		
		//-- Private Methods
		//
		
		function nextDelete() {
			if(delFileList.length > 0) {
				var item = delFileList.shift();
				
				// 해당 파일 items에서 삭제
				self.deleteFtpFile(item.name);
				socket.emit("delete", { path: item.f_path, name: item.name });
			} else {
				var item = delDirList.shift();
				
				if(item) {
					self.changePath(item.f_path);
					delDirPathList.push({ name: item.name, f_path: item.f_path });
				} else {
					isDelMode = false;
					
					if(delDirPathList.length > 0)
						nextDeleteDir();
				}
			}
		}
		
		function nextDeleteDir() {
			if(delDirPathList.length > 0) {
				var item = delDirPathList.pop();
				
				// 해당 파일 items 및 좌측 메뉴에서 삭제
				self.deleteFtpFile(item.name);
				self.left.deleteDir(item.f_path);
				
				socket.emit("rmdir", { path: item.f_path });
			} else {
				self.changePath(d_path);
			}
		}
	
		function init() {
			// 네비게이터 바, 창 조절 기능
			var minSize = $(self.left.root).width(),
				maxSize = minSize * 2,
				barSize = parseInt($(tag.bar).css("left"));
			
			// left, main 크기 변경 창
			$(tag.bar).draggable({ 
				axis: "x", 
				drag: function(event, ui) {
					var pos = barSize - ui.position.left,
						wid = 0;
			
					if(pos > 0) {
						wid = minSize - pos;
					} else {
						wid = minSize + Math.abs(pos);
						
						// 정렬 팝업 위치 변경
						self.wftp.menu.orderMove(wid + 75);
					}
					
					// 최소/최대 크기 지정
					if(wid > minSize && wid < maxSize) { 
						bind.line(wid);
						self.left.bind.leftMenu(wid);
					} else {
						return false;
					}
				}	
			});
			
			// menu / top 즐겨찾기, body 클릭시 hide
			$(root).mouseup(function(e) {
				if(e.which == 1) {
					$(self.wftp.menu.root).hide();
					$(self.wftp.top.tag.ftp_view).hide();
				}
			});
			
			// Body 높이 설정
			initHeight = $(window).height() - 77;
			$(root).height(initHeight);
		}
		
		function getParentPath() {
			if(path != "/") {
				var tmpList = path.split("/"),
					p_path = "";
		
				for(var i = 0; i < tmpList.length - 1; i++) {
					p_path += "/" + tmpList[i]
				}
				
				if(p_path != "/") 
					return p_path.substring(1);
				else
					return p_path;	
			}
			
			return "/";
		}
		
		function alert(msg) {
			wftp.popup.alertShow(msg);
		}
		
		
		
		//-- Public Property
		//
		
		self.wftp 	= opts.wftp;
		self.left 	= new FtpUIBodyLeft({ id: "leftWrap", body: self });
		self.main 	= new FtpUIBodyMain({ id: "mainWrap", body: self });
		
		//-- 초기화 메소드 호출
		init();
	}
	
	exports.FtpUIBody = FtpUIBody;
})(window);