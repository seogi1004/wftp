Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};


//-- Util 함수
//

_.importTpl = function() {
	var path = (_.tplPath != undefined) ? _.tplPath : "tpl";
	
	if(path != "") path = path + "/";
 	
	for(var i in arguments) {
		var tpl = arguments[i],
			url = "",
			sel = "body";
		
		if(tpl.indexOf(":") != -1) {
			var arr = tpl.split(":"),
				sel = "#" + arr[0],
				url = path + arr[1] + ".tpl";			
		} else {
			url = path + tpl + ".tpl";
		}
	    
	    $.ajax({ 
	        url: url, 
	        method: 'GET', 
	        async: false, 
	        success: function(data) { 
	        	$(sel).append(data);  
	        } 
		});
	}
}

_.setCookie = function(name, value) {
	var argc 	= arguments.length,
		argv 	= arguments,
		date	= new Date();
	
	date.setFullYear(2020);

	var expires = (argc > 2) ? argv[2] : date,
		path 	= (argc > 3) ? argv[3] : null,
		domain 	= (argc > 4) ? argv[4] : null,
		secure 	= (argc > 5) ? argv[5] : false;

	document.cookie = name + "=" + escape(value) +
		((expires 	== null) ? "" : ("; expires =" + expires.toGMTString())) +
		((path 		== null) ? "" : ("; path =" + path)) +
		((domain 	== null) ? "" : ("; domain =" + domain)) +
		((secure 	== true) ? "; secure" : "");
}

_.getCookie = function(name) {
	var dcookie = document.cookie;
	var cname = name + "=";
	var clen = dcookie.length;
	var cbegin = 0;
	while (cbegin < clen) {
		var vbegin = cbegin + cname.length;
			if (dcookie.substring(cbegin, vbegin) == cname) {
				var vend = dcookie.indexOf (";", vbegin);
				if (vend == -1) vend = clen;
			return unescape(dcookie.substring(vbegin, vend));
		}
		cbegin = dcookie.indexOf(" ", cbegin) + 1;
		if (cbegin == 0) break;
	}
	
	return "";
}

_.downLink = function(name, data, msg) {
	var temp = $("<div></div>"),
		msg = (!msg) ? "down" : msg;
	
	return temp.append($('<a download="' + decodeURIComponent(name) + '" href="data:application/octet-stream;base64,' + data + '" target="_blank">' + msg + '</a>')).html();
}

_.imgResize = function(img, opts) {
	if(typeof(img) != "object") return;
	
	var options = $.extend({
		maxWidth: 800,
		maxHeight: 600,
		ieWidth: 400,
		ieHeight: 300
	}, opts);
	
	// 원본 이미지 사이즈 저장
	var width = img.width;
	var height = img.height;
	
	// 가로, 세로 최대 사이즈 설정
	var maxWidth = options.maxWidth;
	// 원하는대로 설정. 픽셀로 하려면 maxWidth = 100  이런 식으로 입력
	var maxHeight = options.maxHeight;
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
		img.width = options.ieWidth;
		img.height = options.ieHeight;
	} else {
		// 리사이즈한 크기로 이미지 크기 다시 지정
		img.width = resizeWidth;
		img.height = resizeHeight;
	}
}