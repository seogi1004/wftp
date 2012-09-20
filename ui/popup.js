(function(exports) {
	var FtpUIPopup = function(opts) {
		_.extend(this, new MvvmUI(opts.id));
		
		var self	 = this,
			wftp	 = opts.wftp,
			ftpList	 = wftp.getFtpList();
			
		var root	 = this.root,
			tag		 = this.tag,
			tpl		 = this.tpl,
			act		 = this.act;
		
		
		//-- Public Methods
		//
		
		self.authShow = function() {
			var temp = tpl.tpl_auth("popup_main", { });
			commonShow();
		}

		self.delShow = function() {
			if(!wftp.body.isCheckedItem()) {
				alert("삭제할 파일은 한개 이상 선택해주세요.");
				return;
			}
				
			var temp = tpl.tpl_del("popup_main", { });
			commonShow();
		}

		self.imgShow = function(data, name, ext) {
			var temp = tpl.tpl_img("popup_main", { down: _.downLink(name, data), data: data, ext: ext, name: name, isLink: getLink(name) });
			
			setTimeout(function() {
				imgResize($(temp).find("img").get(0));
				commonShow();
			}, 50);
		}
		
		self.docShow = function(data, name) {
			var ftpInfo = wftp.getFtpInfo();
				isLink = ftpInfo.url ? true : false;
				
			var w = Math.ceil(window.screen.availWidth * 0.7),
				h = Math.ceil(window.screen.availHeight * 0.6);
				
			tpl.tpl_doc("popup_main", { down: _.downLink(name, data), name: name, isLink: getLink(name) });
			$(tag.document).width(w).height(h);
			
			setTimeout(function() {
				commonShow();
			}, 500);
		}
		
		self.notiShow = function() {
			$.getJSON("notice.json", function(data) {
				if(data.show) {
					tpl.tpl_noti("popup_main", { notice:  data.html });
					
					$(tag.notice).width(data.width).height(data.height);
					setTimeout(function() {
						commonShow();
					}, 50);
				}
			});
		}
		
		self.alertShow = function(msg) {
			tpl.tpl_alert("popup_main", { msg: msg });
			commonShow();
		}
		
		self.confirmShow = function(title, text, callback) {
			tpl.tpl_confirm("popup_main", { title: title, text: text });
			
			act.confirmOk = function(e, i) {
				act.commonCancel(e, i);
				callback($(tag.confirm_text).val());
			}
			
			act.confirmOkEnter = function(e, i) {
				if(e.keyCode == 13) act.confirmOk(e, i);
			}
			
			commonShow();
			tag.confirm_text.focus();
		}
		
		self.linkStrShow = function(name) {
			tpl.tpl_link("popup_main", { link: getLink(name) });
			
			commonShow();
			tag.link_txt.focus();
		}
		
		
		//-- Action Definition
		//
		
		act.showLink = function(e, name) {
			self.linkStrShow(name);
		}
		
		act.commonCancel = function(e, i) {
			$(tag.popup_main).hide();
			$(tag.blinder).hide();
			$(root).hide();
		}
		
		act.authOk = function(e, i) {
			var args = tag.val("input");
			
			// 유효성 체크
			if(!args.name || !args.host || !args.user || !args.passwd) {
				alert("'Default Path'와 'Ftp Url'을 제외한 모든 입력 폼은 필수 사항입니다.");
				return;
			}
			
			// FTP List 추가
			if(ftpList) { 
				if(ftpList.addFtp(args)) {
					// FTP 인증
					wftp.connect(args);
					act.commonCancel();
				} else {
					alert("이미 등록된 Ftp서버입니다.");
				}
			}
		}
		
		act.delOk = function(e, i) {
			wftp.body.deleteItem();
			act.commonCancel();
		}
		
		
		//-- Private Methods
		//
		
		function commonShow(callback) {
			var eh = $(wftp.body.root).height() + $(wftp.footer.root).height();
			$(tag.blinder).height(eh);
			$(root).show();
			
			// 
			//setTimeout(function() {
				var screenWidth = window.screen.availWidth,
					screenHeight = window.screen.availHeight;
					
				var popupWidth = $(tag.popup_main).width(),
					popupHeight = $(tag.popup_main).height();
					
				var x = Math.ceil(screenWidth / 2) - Math.ceil(popupWidth / 2),
					y = Math.ceil(screenHeight / 2) - Math.ceil(popupHeight / 2);
					
				$(tag.blinder).show();
				$(tag.popup_main).css({ left: x + "px", top: y + "px" }).show();
			//}, 100);
		}

		function imgResize(img) {
			// 원본 이미지 사이즈 저장
			var width = img.width;
			var height = img.height;
			
			// 가로, 세로 최대 사이즈 설정
			var maxWidth = 800;
			// 원하는대로 설정. 픽셀로 하려면 maxWidth = 100  이런 식으로 입력
			var maxHeight = 600;
			// 원래 사이즈 * 0.5 = 50%

			// 가로나 세로의 길이가 최대 사이즈보다 크면 실행
			if (width > maxWidth || height > maxHeight) {

				// 가로가 세로보다 크면 가로는 최대사이즈로, 세로는 비율 맞춰 리사이즈
				if (width > height) {
					resizeWidth = maxWidth;
					resizeHeight = Math.round((height * resizeWidth) / width);

					// 세로가 가로보다 크면 세로는 최대사이즈로, 가로는 비율 맞춰 리사이즈
				} else {
					resizeHeight = maxHeight;
					resizeWidth = Math.round((width * resizeHeight) / height);
				}

				// 최대사이즈보다 작으면 원본 그대로
			} else {
				resizeWidth = width;
				resizeHeight = height;
			}
			
			// IE일 경우, 예외처리
			if($.browser.msie) {
				img.width = 400;
				img.height = 300;
			} else {
				// 리사이즈한 크기로 이미지 크기 다시 지정
				img.width = resizeWidth;
				img.height = resizeHeight;
			}
		}
		
		function getLink(name) {
			var ftpInfo = wftp.getFtpInfo(),
				ftpFile = wftp.body.getFtpFile(name),
				isLink = ftpInfo.url ? true : false;
				
			if(!isLink) return isLink;
			else return "http://" + ftpInfo.url + ftpFile.f_path;
		}
		
		function alert(msg) {
			self.alertShow(msg);
		}
	}

	exports.FtpUIPopup = FtpUIPopup;
})(window);