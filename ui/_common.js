(function(exports) {
	var FtpList = function() {
		var self = this,
			list = new Array();
		
		function init() {
			var cookie = _.getCookie("__ftplist__");
			
			if(cookie) {
				list = JSON.parse(cookie);
			}
			
			// 테스트 FTP, 추가
			self.addFtp({
				name: "<b>wFTP 테스트</b>",
				host: "youngman.kr",
				user: "wftp",
				passwd: "wftp",
				d_path: "/wftp",
				url: "seogi777.cafe24.com/static/wftp"
			});
		}
		
		self.addFtp = function(args) {
			if(!self.getFtp(args.name)) {
				list.push(args);
				_.setCookie("__ftplist__", JSON.stringify(list));
				
				return true;
			} 
			
			return false;
		}
		
		self.delFtp = function(name) {
			for(var i = 0; i < list.length; i++) {
				if(list[i].name == name) {
					list.splice(i, 1);
					_.setCookie("__ftplist__", JSON.stringify(list));
				}
			}
		}
		
		self.getFtp = function(name) {
			for(var i = 0; i < list.length; i++) {
				if(list[i].name == name) {
					// URL 변조, 'http://' 제거
					if(list[i].url.indexOf("http://") != -1) {
						var url = list[i].url;
						list[i].url = url.substring(7);
					}
					
					return list[i];
				}
			}
		}
		
		self.getFtpList = function() {
			init();
			
			return list;
		}
		
		init();
	}
	
	var FtpTimer = function() {
		var sec = 0;
		var runner = null;
		
		//-- Private Methods
		//
		
		function getTimeStr(sec) {
			if(sec < 60) {
				return sec + "초";
			} else if(sec < 3600) {
				return parseInt(sec / 60) + "분 " + (sec % 60) + "초";
			} else if(sec < 3600 * 24) {
				return parseInt(sec / 3600) + "시간 " + (sec % 3600) + "분";
			}
		}
		
		//-- Public Methods
		//
		
		this.run = function(callback) {
			runner = setInterval(function() {
				callback(getTimeStr(sec++));
			}, 1000);
		}
		
		this.reset = function() {
			clearInterval(runner);
			sec = 0;
		}
	}
	
	var FtpProcess = function(packetTotCnt, packetTotSize) {
		var count = 0;
		var packetSize = 0;
		
		this.run = function(callback) {
			count += 1;
			
			packetSize += (FtpFile.packetSize * 1024);
			packetSize = (packetSize >= packetTotSize) ? packetTotSize : packetSize;
			
			var tmp_per = Math.round((count / packetTotCnt) * 99),
				per = ((tmp_per >= 99) ? 99 : tmp_per) + "%";
				
			callback(FtpFile.getSizeStr(packetSize), per);
		}
	}
	
	var FtpDir = function(ftpFile, p_path) {
		var self = this,
			p_path = replacePath(p_path),
			d_type = "collapsable"; // collapsable
		
		self.name = ftpFile.name,
		self.f_path = replacePath(ftpFile.f_path),
		self.r_f_path = ftpFile.f_path;
		
		self.init = function() {
			if(self.name != "/") {
				$("[data-child=" + p_path + "]").append(getHtml());
				
				if(d_type == "collapsable") { 
					$("[data-child=" + self.f_path + "]").hide();
				}
			} else {
				$("#dirList").html(getHtml());
			}
		}
		
		self.changeType = function() {
			d_type = (d_type == "expandable") ? "collapsable" : "expandable";
		}
		
		self.deleteDir = function() {
			$("[data-dir=" + self.f_path + "]").remove();
		}
		
		function getHtml() {
			var tpl = $("#tpl_dir").html();
			
			return _.template(tpl, {
				name: self.name,
				f_path: self.f_path
			});
		}
		
		function replacePath(path) {
			var tmp = path.split("/").join("_");
			return tmp.split(".").join("_");
		}
	}
	
	FtpDir.getDirList = function(ftpFiles, p_path) {
		var result = [];
		
		for(var i in ftpFiles) {
			if(ftpFiles[i].is_dir) {
				var dir = new FtpDir(ftpFiles[i], p_path);
				result.push(dir);
			}
		}
		
		return result;
	}
	
	var FtpFile = function(file, path) {
		var s_size		= 0;										// 전송 사이즈

		this.name 		= file.name;								// 파일 또는 디렉토리 이름
		this.ext 		= getFileExt(this.name);					// 파일 확장자, 디렉토리는 dir
		this.t_ext 		= getFileExtType(this.ext);					// 파일 확장자 타입, 디렉토리는 dir
		this.size 		= file.size;								// 파일 또는 디렉토리 크기
		this.u_size	 	= FtpFile.getSizeStr(this.size);			// 파일 또는 디렉토리 크기 (단위)
		this.p_dir		= FtpFile.getParentDir(this.path);			// 현재 파일 또는 디렉토리의 상위 디렉토리 이름
		this.path		= path;										// 현재 파일 또는 디렉토리를 제외한 상위 패스
		this.is_syn		= isSyntaxType(this.ext);
		
		if(file.type == 1) 	this.is_dir = true;
		else 				this.is_dir = false;
		
		if(file.lastModifiedDate) {
			this.date = file.lastModifiedDate.format("yyyy.MM.dd hh:mm:ss");
			this.date2 = file.lastModifiedDate.format("yy.MM.dd hh:mm");
		} else if(file.time) {
			this.date = new Date(file.time).format("yyyy.MM.dd hh:mm:ss");
			this.date2 = new Date(file.time).format("yy.MM.dd hh:mm");
		}
		
		//-- Private Methods
		//
		
		function isSyntaxType(ext) {
			var types = [ "js", "xml", "xhtml", "xslt", "html", "vb", "sql", "txt", "php", "pl", "perl", "java", "css", "cs", "cpp", "c", "bash", "shell", "log" ];
		
			for(var i in types) {
				if(types[i] == ext) {
					return true;
				}
			}
			
			return false;
		}
		
		function getFileExtType(ext) {
			var types = {
				img : [ "bmp", "gif", "jpg", "jpeg", "png", "psd", "ai", "tif" ],
				doc : [ "doc", "docx", "ppt", "pptx", "xls", "xlsx", "hwp", "txt", "pdf", "c", "cpp", "java", "htm", "html", "css", "js", "log", "note" ],
				mus : [ "au", "mid", "mod", "mp2", "mp3", "ogg", "ra", "rm", "snd", "voc", "wav", "wma", "m4a", "note" ],
				mov : [ "avi", "mov", "mpg", "mv", "asf", "asx", "qt", "rv", "wmx", "mp4", "fla", "flv", "swf" ],
				com : [ "alz", "arj", "bz2", "egg", "gz", "jar", "rar", "tar", "tgz", "zip", "7z" ]
			};
			
			for(var i in types) {
				for(var j in types[i]) {
					if(types[i][j] == ext) {
						return i;
					}
				}
			}
			
			return "etc";
		}
		
		function getFileExt(name) {
			if(this.is_dir) {
				return "dir";
			} else {
				if(name) {
					var tmp = name.split(".");
						ext = tmp[tmp.length - 1];
					
					if(typeof(ext) == "string") {
						return ext.toLowerCase();
					}
				}
				
				return "";
			}
		}
		
		//-- Public Methods
		//
				
		this.setPacketList = function(index, callback) {
		    var sliceSize = FtpFile.packetSize * 1024,
		  		slice = 0,
		  		fr = new FileReader();
		    
			var slices = Math.ceil(file.size / sliceSize);
			var pList = [];
		    
		    function loadNext() {
				var start, end;
			
				start = slice * sliceSize;
				end = start + sliceSize >= file.size ? file.size : start + sliceSize;
			
				fr.onload = function(event) {      
					if(++slice <= slices) {
						pList.push(event.target.result);
				      	loadNext();
					} else {
						callback(index, pList);
					}
				};
				   
				var blob = (file.slice) ? file.slice(start, end) : file.webkitSlice(start, end);
				fr.readAsBinaryString(blob);
			}
			
			loadNext();
		}
		
		this.getPacketCount = function() {
			var sliceSize = FtpFile.packetSize * 1024;
		    return Math.ceil(file.size / sliceSize);
		}
		
		this.sendPacket = function() {
			s_size += FtpFile.packetSize * 1024;
			s_size = (s_size >= this.size) ? this.size : s_size;
			
			return FtpFile.getSizeStr(s_size);
		}
		
		this.getLink = function(url) {
			var url = url + "/" + encodeURIComponent(this.name);
			return "<a href='" + url + "' target='_blank'>" + this.name + "</a>";
		}
		
		this.setFullPath = function(name) {
			this.name = name;
			
			if(path != "/") 	this.f_path	= path + "/" + name;	// 현재 파일 또는 디렉토리의 전체 패스
			else				this.f_path = path + name;
			
			if(this.f_path == "//") this.f_path = "/";
		}
		
		// Full Path 설정
		this.setFullPath(this.name);
	};
	
	FtpFile.fileUpMaxSize = 100;	// 업로드 파일 최대 용량 (단위 MB)
	FtpFile.fileDownMaxSize = 1;	// 다운로드 파일 최대 용량 (단위 MB)
	FtpFile.packetSize = 512;		// 파일 패킷 전송시 크기 (단위 KB)
	
	FtpFile.getSizeStr = function(size) {
		var result = 0;
		var ext = "B";
		
		if(size >= 1024) {
			result = Math.round(size / 1024);
			ext = "KB";
		}
		
		if(result >= 1024) {
			var num = result / 1024;
			
			result = Math.round(num * 10) / 10;
			ext = "MB";
		} 
		
		return [ result, ext ].join('');
	};
	
	FtpFile.getFileList = function(files, path) {
		var result = [];
		
		for(var i in files) {
			if(typeof(files[i]) == "object") {
				var file = new FtpFile(files[i], path);
				result.push(file);
			}
		}
		
		return result;
	};
	
	FtpFile.getParentDir = function(path) {
		if(!path) return "/";
		else {
			var tmpList = path.split("/");
	
			for(var i = tmpList.length - 1; i > 0; i--) {
				if(tmpList[i] != "") return tmpList[i];
			}
		}
	}
	
	FtpFile.sort = function(files, type, order) {
		var a = files, swapped;
		var result = [];
		
	    do {
	        swapped = false;
	        
	        for(var i = 0; i < a.length - 1; i++) {
	            var i1 = a[i],
	            	i2 = a[i + 1];
	            	
	            var o1, o2;
	            if(type == "size") {
	            	o1 = parseInt(i1[type]);
	            	o2 = parseInt(i2[type]);
	            } else {
	            	o1 = i1[type].toLowerCase();
	            	o2 = i2[type].toLowerCase();
	            }
	            	
	            if(order == "asc") {
		            if(o1 > o2) {
		                var temp = a[i];
		                a[i] = a[i + 1];
		                a[i + 1] = temp;
		                swapped = true;
		            }
	            } else {
		            if(o1 < o2) {
		                var temp = a[i];
		                a[i] = a[i + 1];
		                a[i + 1] = temp;
		                swapped = true;
		            }
	            }
	        }
	    } while(swapped);
	    
	    for(var i in a) {
	    	if(a[i].is_dir) {
	    		result.push(a[i]);
	    	}
	    }
	    
	    for(var i in a) {
	    	if(!a[i].is_dir) {
	    		result.push(a[i]);
	    	}
	    }
	    
	    return result;
	}
	
	exports.FtpDir = FtpDir;
	exports.FtpFile = FtpFile;
	exports.FtpProcess = FtpProcess;
	exports.FtpTimer = FtpTimer;
	exports.FtpList = FtpList;
})(window);