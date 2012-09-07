(function(exports) {
	var FtpUITop = function(opts) {
		_.extend(this, new MvvmUI(opts.id));
	
		var wftp	 = opts.wftp,
			ftpList	 = wftp.getFtpList();
		
		var root	 = this.root,
			act		 = this.act,
			tag		 = this.tag,
			tpl		 = this.tpl;
			
		
		//-- Action Definition
		//
		
		act.ftpAdd = function(e) {
			wftp.popup.authShow();
		}
		
		act.ftpList = function(e) {
			var sel = $(tag.ftp_view),
				list = ftpList.getFtpList();
			
			// UI 넓이 조정, 목록 리스트 출력
			if(list.length < 9) {
				sel.width(160);
				tpl.ftpList1({ items: list.slice(0, 8) }); 
			} else {
				sel.width(338);
				tpl.ftpList1({ items: list.slice(0, 8) }); 
				tpl.ftpList2({ items: list.slice(9) }); 
			}
			
			// UI, show/hide
			if(sel.css("display") == "none") 
				sel.show();
			else 
				sel.hide();
		}
		
		act.ftpConn = function(e, name) {
			wftp.connect(ftpList.getFtp(name));
			$(tag.ftp_view).hide();
		}
		
		act.ftpDel = function(e, name) {
			alert("'" + name + "'가 삭제되었습니다.");
			
			ftpList.delFtp(name)
			$(tag.ftp_view).hide();
		}
		
		//-- Private Functions
		//
		
		function alert(msg) {
			wftp.popup.alertShow(msg);
		}
	}
	
	exports.FtpUITop = FtpUITop;
})(window);