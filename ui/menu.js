(function(exports) {
	var FtpUIMenu = function(opts) {
		_.extend(this, new MvvmUI(opts.id));
		
		var self	 = this,
			wftp	 = opts.wftp;
			
		var root	 = this.root,
			tag		 = this.tag,
			tpl		 = this.tpl,
			act		 = this.act;
			
		var orderX	 = 280;
		var callback = null;
		
		
		//-- Public Methods
		//
		
		self.orderShow = function(func) {
			commonShow("tpl_order", orderX, 153, func);
		}
		
		self.orderMove = function(val) {
			orderX = val;
			$(root).css({ left: orderX + "px", top: 153 });
		}
		
		self.menuShow = function(is_dir, x, y, func) {
			var id = (is_dir) ? "tpl_menu_d" : "tpl_menu_f",
				w = window.screen.availWidth - 130,
				x = (x > w) ? w : x;
			
			commonShow(id, x, y, func);
		}
		
		
		//-- Action Definition
		//
		
		act.orderOk = function(e, type) {
			if(callback) {
				callback(type);
				commonCancel();
			}
		}
		
		act.menuOk = function(e, type) {
			if(callback) {
				callback(type);
				commonCancel();
				
				e.preventDefault();
			}
		}
		
		
		//-- Private Methods
		//
		
		function commonShow(id, x, y, func) {
			commonCancel();
			tpl[id]("menu_main");
			
			$(root).css({ position: "absolute", left: x + "px", top: y + "px" }).show();
			callback = func;
		}
		
		function commonCancel() {
			$(root).hide();
		}
		
		function alert(msg) {
			wftp.popup.alertShow(msg);
		}
	}

	exports.FtpUIMenu = FtpUIMenu;
})(window);