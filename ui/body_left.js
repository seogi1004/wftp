(function(exports) {
	var FtpUIBodyLeft = function(opts) {
		_.extend(this, new MvvmUI(opts.id));

		var self 		= this,
			dirList 	= null;
		
		var	root 		= this.root,
			bind 		= this.bind,
			tag			= this.tag,
			act	 		= this.act,
			tpl	 		= this.tpl;
			
			
		//-- Public Methods
		//
		
		self.updateDir = function() {
			var status = self.body.getStatus();
			
			addDir(FtpDir.getDirList(status.items, status.path));
			$(tag.dirList).treeview();
			
			// 화면 리사이즈
			self.body.resizeView();
		}
		
		self.deleteDir = function(f_path) {
			var key = f_path.split("/").join("_");
			
			if(dirList[key]) {
				dirList[key].deleteDir();
				dirList[key] = null;
			}
			
			self.updateDir();
		}
		
		// FTP 주소가 변경되었을 경우,
		self.initDir = function() {
			$(tag.dirList).html("");
			dirList = {};
			
			var rootFile = new FtpFile({ name: "/", type: 1 }, "");
			addDir(FtpDir.getDirList([ rootFile ], "/"));
		}
		
		
		//-- Action Definition
		//
		
		act.showUpload = function(e, i) {
			self.body.wftp.upload.show();
		}
		
		act.changePath = function(e, path) {
			// 폴더 상태변경, root 제외
			if(dirList[path] != undefined) {
				var dir = dirList[path];
				
				dir.changeType();
				self.body.changePath(dir.r_f_path);
				
				e.stopPropagation();
			}
		}
		
		
		//-- Private Methods
		//
		
		function addDir(dList) {
			for(var i in dList) {
				var key = dList[i].f_path;
				
				if(!dirList[key]) { 
					dirList[key] = dList[i];
				}
			}
			
			for(var i in dirList) {
				if(dirList[i]) { 
					dirList[i].init();
				}
			}
		}
		
		
		//-- Public Property
		//
		
		self.body		= opts.body;
	}
	
	exports.FtpUIBodyLeft = FtpUIBodyLeft;
})(window);