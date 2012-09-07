(function(experts) {
	var MvvmUI = function(id) {
		var	self 		= this;
			self.root 	= (id) ? $("#" + id).get(0) : $("body").get(0),
			self.act 	= {},
			self.bind 	= {},
			self.tag	= {},
			self.tpl 	= {};
	
		function init() {
			var $root = $(self.root);
			
			initAct($root);
			initBind($root);
			initTag($root);
			initTpl($root);
		}
		
		function initAct(root) {
			root.on("click", "[data-act]", function(e) {
				initActProc("click", e);
			});
			
			root.on("mousedown", "[data-act]", function(e) {
				initActProc("mousedown", e);
			});
			
			root.on("mouseup", "[data-act]", function(e) {
				initActProc("mouseup", e);
			});

			root.on("dblclick", "[data-act]", function(e) {
				initActProc("dblclick", e);
			});

			root.on("change", "[data-act]", function(e) {
				initActProc("change", e);
			});

			root.on("keyup", "[data-act]", function(e) {
				initActProc("keyup", e);
			});
		}
		
		function initActProc(type, e) {
			var elem = e.currentTarget;
			var act = $(elem).data('act');
			var atype = ($(elem).data('type')) ? $(elem).data('type') : "click";
			
			if(atype == type) {
				if(act.indexOf(':') == -1) {
					if(self.act[act]) {
						self.act[act].call(self, e); 
					}
				} else {
					var actArr = act.split(":");
					
					if(self.act[actArr[1]]) { 
						self.act[actArr[1]].call(self, e, actArr[0]); 
					} 
				}
			}
		}
		
		function initBind(root) {
			var funcList = [],
				bindList = [];
			var sel = root.find("[data-bind]");
			
			sel.each(function(i) {
				var $this = $(this),
					func = $this.data("bind");
				
				if(func.indexOf(':') == -1) {
					bindList.push({ name: func, elem: this });
				} else {
					var funcArr = func.split(":");
					funcList.push({ func: funcArr[1], key: funcArr[0], data: $this.get(0) });
				}
				
				if(sel.size() == i + 1) {
					settingFunc("bind", funcList);
					settingBindMulti(bindList);
				}
			});
		}
		
		function initTag(root) {
			var funcList = [];
			var sel = root.find("[data-tag],[id]");
	
			sel.each(function(i) {
				var $this = $(this),
					tmp_func = $this.data("tag");
				
				// data-tag 태그가 있을 경우,
				var func = tmp_func,
					isId = false;
				
				// data-tag 태그가 없고, id일 경우
				if(typeof(tmp_func) != "string") { 
					func = this.id;
					isId = true;
				}
				
				// id는 멀티를 지원하지 않음
				if(func.indexOf(':') == -1 || isId) {
					eval("self.tag." + func + " = $this.get(0);");
				} else {
					var funcArr = func.split(":");
					funcList.push({ func: funcArr[1], key: funcArr[0], data: $this.get(0) });
				}
				
				if(sel.size() == i + 1) {
					settingFunc("tag", funcList);
				}
			});
		}
		
		function initTpl(root) {
			root.find("script[type*=template]").each(function(i) {
				var $this	= $(this),
					$cont	= root.find("[data-tpl=" + this.id + "]"),
					id		= this.id;
				
				var tplFunc = function() {
					var sel	= $cont,
						obj = arguments[0];
					
					// 결과 값을 입력할 엘리먼트의 id가 있을 경우
					if(typeof(obj) == "string") {
						sel = root.find("#" + arguments[0]);
						obj = arguments[1] ? arguments[1] : {};
						id	= arguments[0];
					}
					
					//  tpl 갱신
					sel.html(_.template($this.html(), obj));
					
					// bind/tag 갱신
					initBind(sel);
					initTag(sel);
					
					// 템플릿 대상 tag를 갱신
					if(self.tag[id]) { 
						self.tag[id] = sel.get(0);
					}
					
					return sel.get(0);
				}
				
				eval("self.tpl." + this.id + " = tplFunc;");
			});
		}
		
		/**
		 * bind 태그일 경우, 
		 * 엘리먼트 유형에 따라 처리하는 함수
		 * 
		 * @param {Element} elem
		 * @param {String} value 
		 */
		function settingBindProc(elem, value) {
			var attr = $(elem).data("attr"),
				css	 = $(elem).data("css");
				
			if(!attr && !css) {
				if(elem.value == undefined) 
					$(elem).html(value);
				else 			
					$(elem).val(value);
			} else {
				if(attr) $(elem).attr(attr, value);
				if(css)	 $(elem).css(css, value);
			}
		}	
		
		/**
		 * bind 태그일 경우, 
		 * 단일/멀티 유형에 따라 처리하는 함수
		 * 
		 * @param {Array} bindList
		 */
		function settingBindMulti(bindList) {
			var list = new Object();
			
			for(var i in bindList) {
				var obj = bindList[i];
				if(!list[obj.name]) list[obj.name] = [];
				
				list[obj.name].push(obj.elem);
			}
			
			for(var func in list) {
				(function(func) {
					self.bindMultiProc = function(value) {
						var elemList = list[func];
						
						for(var j in elemList) {
							var elem = elemList[j];
							
							settingBindProc(elem, value);
						}
						
						return (elemList.length > 1) ? elemList : elemList[0];
					}
				})(func);
				
				eval("self.bind." + func + " = self.bindMultiProc;");
			}
		}
		
		/**
		 * bind/tag 태그 메소드 세팅 함수
		 * bind일 경우, settingBindProc 호출
		 * 
		 * @param {String} type
		 * @param {Array} funcList
		 */
		function settingFunc(type, funcList) {
			for(var i in funcList) {
				var func = funcList[i].func;
				
				(function(func) {
					self.funcMultiProc = function(key, value) {
						var data = getFuncElem(funcList, func, key);
						
						if(type == "bind") {
							settingBindProc(data, value);
							return data;
						
						} else if(type == "tag") {
							return data;
						}
					};
				})(func);
				
				function getFuncElem(funcList, func, key) {
					for(var i in funcList) {
						var obj = funcList[i];
						
						if(obj.func == func && obj.key == key) {
							return obj.data;
						}
					}
				}
				
				eval("self." + type + "." + func + " = self.funcMultiProc;");
			}
		}
		
		/**
		 * bind/tag 태그, 값을 가져오는 함수
		 * 
		 * @param {String} type
		 * @param {String} key
		 * @param {Boolean} is_elem
		 */
		function _get(type, key, is_elem) {
			if(type != "bind" && type != "tag") return undefined;
			
			var sel 	= "[data-" + type + "=" + key + "]" + ((type == "tag") ? ",#" + key : ""),
				elem 	= null,
				size	= $(sel).size();
			
			if(size > 0) {
				var result = $(sel).get(0);
				if(!is_elem) result = getData(type, result);
				
				return result;
			} else {
				var selList = $("[data-" + type + "*=" + key + "]");
				return getDataList(type, selList);			
			}
			
			function getDataList(type, selList) {
				var list = new Object();
				
				selList.each(function(i) {
					var keyArr = $(this).data(type).split(":"),
						result = this;
					
					if(!is_elem) result = getData(type, result);
					list[keyArr[0]] = result;
				});
				
				return list;
			}
			
			function getData(type, elem) {
				if(type == "bind") {
					var attr = $(elem).data("attr"),
						css	 = $(elem).data("css"),
						res  = "";
					
					if(!attr && !css) {
						if(elem.value == undefined) 
							res = $(elem).html();
						else 			
							res = $(elem).val();
					} else {
						if(attr) res = $(elem).attr(attr);
						if(css)	 res = $(elem).css(css);
					}
				} else {
					if(!elem.value) res = $(elem).html();
					else 			res = $(elem).val();
				}
				
				return res;
			}
		}
		
		//--
		//
		
		self.bind.get = function(key) {
			return _get("bind", key, true);
		}

		self.tag.get = function(key) {
			return _get("tag", key, true);
		}

		self.bind.val = function(key) {
			return _get("bind", key, false);
		}

		self.tag.val = function(key) {
			return _get("tag", key, false);
		}
		
		init();
	}
	
	experts.MvvmUI = MvvmUI;
})(window);