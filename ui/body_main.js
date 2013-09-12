(function(exports) {
	var FtpUIFileList = function(opts) {
		vo.applyTo(this, opts.id);	
			
		var main		= opts.main,
			type		= "view";
		
		var self		= this,
			root		= this.root,
			bind		= this.bind,
			tpl			= this.tpl,
			act			= this.act,
			tag			= this.tag;
		
		
		//-- Public Methods
		//
		
		self.show = function(items, p_path) {
			var	items 	= (items) ? items : [],
				args	= { items: items, p_path: p_path };
			
			if(type == "list") {
				tpl.tpl_list("filelist_view", args);
			} else {
				main.body.viewThumbs(items); // 썸네일 처리
				tpl.tpl_view("filelist_view", args);
			}
			
			
			//-- UI 설정
			$(tag.filelist_view).find(".item").hover(function(e) {
				$(e.currentTarget).addClass("over");
			}, function(e) {
				$(e.currentTarget).removeClass("over");
			});
			
			//-- UI 설정, 단일 파일 대상의 menu
			$(tag.filelist_view).find(".item").each(function(i) {
				this.oncontextmenu = function(e) {
					var targetIndex = $(e.currentTarget).data("index"),
						ftpFile = main.body.getFtpFileIndex(targetIndex);
					
					act.onlyCheckedFile(e);
					e.preventDefault();
					
					main.body.wftp.menu.menuShow(ftpFile.is_dir, e.pageX, e.pageY, function(type) {
						main.body.contextMenu(ftpFile.name, type);
					});
				}
			});
		}
		
		self.changeMode = function(key) {
			var status = main.body.getStatus();
			
			if(status != null) {
				type = key;
				self.show(status.items, status.p_path);
			}
		}
		
		//-- Event Definition
		//
		
		act.changePath = function(e, path) {
			main.body.changePath(path);
			e.stopPropagation();
		}
		
		act.link = function(e, name) {
			main.body.readItem(name);
			e.stopPropagation();
		}
		
		act.checkedFile = function(e, index) {
			var parent = $(e.target).parent().parent(),
				isChecked = false;
			
			if(type == "list") parent = parent.parent();
			if($(e.target).attr("checked")) isChecked = true;
			
			checkedFile(parent, index, isChecked);
		}
		
		act.onlyCheckedFile = function(e) {
			var targetIndex = $(e.currentTarget).data("index");
			
			if(e.target != tag.ck_files[targetIndex]) { // 체크박스 클릭시 제외
				var ftpFile = main.body.getFtpFileIndex(targetIndex);
					
				for(var name in tag.item) {
					var target = tag.item[name],
						index = $(tag.item[name]).data("index"),
						isChecked = (ftpFile.name == name) ? true : false;
						
					checkedFile(target, index, isChecked);
				}
			}
			
			e.stopPropagation();
		}
		
		act.showRenameTxt = function(e, index) {
			$(tag.file_name[index]).hide();
			$(tag.rename_txt[index]).show();
			
			e.stopPropagation();
		}
		
		act.changeName = function(e, index) {
			if(e.keyCode == 13) {
				// before, after 파일명 가져오기
				var ftpFile = main.body.getFtpFileIndex(index),
					rename = tag.rename_txt[index].value;
					
				//
				main.body.changeName(ftpFile.name, rename);
			}
			
			e.stopPropagation();
		}
		
		act.orderList = function(e, t) {
			var orders = tag.orderType, o;
			var cls = $(orders[t]).attr("class");
			
			if(cls == "selectbox_asc") o = "desc";
			else o = "asc";
			
			//-- 파일 목록 정렬 
			sort(t, o);
			
			//-- UI 변경
			for(var i in orders) {
				var selOrder = $(orders[i]);
				
				if(t == i) {
					selOrder.removeClass("selectbox_none").addClass("selectbox_" + o);
				} else {
					selOrder.removeClass("selectbox_" + o).addClass("selectbox_none");
				}
			}
			
			e.stopPropagation();
		}

		act.orderPreview = function(e, t, o) {
			var arrName = {
				"ext": "종류순", "name": "이름순", "size": "크기순", "date": "날짜순",
			};
			
			if(t && o) {
				sort(t, o);
				bind.orderName(arrName[t]);
			} else {			
				main.body.wftp.menu.orderShow(function(t) {
					var orders = tag.orderType;
					
					if($(orders).html() == "내림차순") o = "desc";
					else o = "asc";
					
					sort(t, o);
					bind.orderName(arrName[t]);
				});
			}
			
			e.stopPropagation();
		}
		
		// 프리뷰 형태에서만 사용
		act.changeOrder = function(e) {
			var arrExt = {
				"종류순": "ext", "이름순": "name", "크기순": "size", "날짜순": "date",
			};
			
			var orderType = bind.val("orderType"),
				orderName = bind.val("orderName");
				
			var t = arrExt[orderName], o;
			
			if(orderType == "오름차순") {
				orderType = "내림차순";
				o = "desc";
			} else {
				orderType = "오름차순";
				o = "asc";
			}
			
			act.orderPreview(e, t, o);
			
			// UI 변경
			bind.orderType(orderType);
		}
		
		act.nonDevelopMsg = function(e) {
			alert("아직 구현되지 않은 기능입니다.");
		}

		
		//-- Private Methods
		//
		
		function checkedFile(target, index, isChecked) {
			$(target).find("input[type=checkbox]").attr("checked", isChecked);
			main.body.checkedItem(index, isChecked);
			
			if(isChecked) {
				$(target).addClass("on");
			} else {
				$(target).removeClass("on");
			}
		}
		
		function sort(t, o) {
			//-- 데이터 변경
			var info 	= main.body.getStatus(),
				items	= FtpFile.sort(info.items, t, o);
				
			main.body.setItems(items);
			self.show(items, info.p_path);
		}
		
		function alert(msg) {
			main.body.wftp.popup.alertShow(msg);
		}
	}

	var FtpUIToolbar = function(opts) {
		vo.applyTo(this, opts.id);
		
		var main		= opts.main;
		
		var self		= this,
			root		= this.root,
			bind		= this.bind,
			tpl			= this.tpl,
			act			= this.act;
			
		
		//-- Event Definition
		//
		
		act.changeMode = function(e, key) {
			if(!isConnect()) return;
			
			if(key == "list") {
				bind.listtype("block");
				bind.viewtype("none");
			} else {
				bind.listtype("none");
				bind.viewtype("block");
			}
			
			main.changeMode(key);
			e.stopPropagation();
		}
		
		act.allChecked = function(e) {
			var ck_files = main.filelist.tag.ck_files;
			self.isAllChecked = !self.isAllChecked;
			
			for(var i in ck_files) {
				var elem = ck_files[i];
				$(elem).attr("checked", self.isAllChecked);
				
				main.filelist.act.checkedFile({ target: elem }, i);
			}
		}
		
		act.createDir = function(e) {
			if(!isConnect()) return;
			
			main.body.wftp.popup.confirmShow("폴더생성하기", "", function(text) {
				if(text == "") {
					alert("폴더명을 입력해주세요.");
				} else {
					main.body.createDir(text);
				}
			});
			
			e.stopPropagation();
		}
		
		act.deleteItem = function(e) { // 삭제 확인 UI 보이기
			main.body.wftp.popup.delShow();
			e.stopPropagation();
		}
		
		act.checkedDown = function(e) {
			main.body.checkedDown();
			e.stopPropagation();
		}
		
		act.nonDevelopMsg = function(e) {
			alert("아직 구현되지 않은 기능입니다.");
			e.stopPropagation();
		}
		
		
		//-- Private Methods
		//
		function alert(msg) {
			main.body.wftp.popup.alertShow(msg);
		}
		
		function isConnect() {
			if(!main.body.wftp.isConn) {
				alert("FTP 서버에 연결되지 않았습니다.");
				return false;
			}
			
			return true;
		}
		
		
		//-- Public Property
		//
		
		self.isAllChecked = false;
	}
	
	var FtpUIBodyMain = function(opts) {
		vo.applyTo(this, opts.id);
		
		var self = this,
			act	 = this.act;
		
		
		//-- Public Methods
		//
		
		self.changePath = function(items, path, p_path) {
			self.filelist.show(items, p_path);
			
			self.toolbar.bind.path(getNaviLink(path));
			self.toolbar.isAllChecked = false;
			
			// 화면 리사이즈
			self.body.resizeView();
		}
		
		self.changeMode = function(key) {
			self.filelist.changeMode(key);
		}
		
		
		//-- Action Definition
		//
		
		act.changePathNavi = function(e, path) {
			self.body.changePath(path);
		}
		
		
		//-- Private Methods
		//
		
		function getNaviLink(path) {
			var pathArr = path.split("/"),
				f_path = "",
				html = "";
				
			if(pathArr.join("") == "") {
				html = "/";
			} else {
				for(var i in pathArr) {
					if(pathArr[i] != "") {
						f_path += "/" + pathArr[i];
						html += "/<a href='#' data-act='" + f_path + ":changePathNavi'>" + pathArr[i] + "</a>";
					}
				}
			}
			
			return html;
		}
		
		
		//-- Public Property
		//
		
		self.body		= opts.body;
		self.filelist	= new FtpUIFileList({ id: "m_filelist", main: self }),
		self.toolbar	= new FtpUIToolbar({ id: "m_toolbar", main: self });
	}
	
	exports.FtpUIBodyMain = FtpUIBodyMain;
})(window);