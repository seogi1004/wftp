var JSFtp = require("jsftp"),
	FS = require('fs'),
	_ = require("underscore"),
	assert = require("assert");

module.exports = function(socket, opts) {
	var def_order = {
		"list"		: "procFtpList",
		"upload"	: "procFtpUpload",
		"download"	: "procFtpDownload",
		"delete"	: "procFtpDelete",
		"rename"	: "procFtpRename",
		"mkdir"		: "procFtpMkdir",
		"rmdir"		: "procFtpRmdir",
		"read"		: "procFtpRead"
	};
	
	var def_opts = _.extend({
		port: 21
	}, opts);
    
	var msg_type = "",
    	uploadBlobList = [],
    	downloadBlobList = [],
		ftp = new JSFtp({ host: def_opts.host, port: def_opts.port });
	
	
	/**
	 * public method, related ftp
	 * 
	 */
	this.auth = function(callback) {
		procFtpAuth(function(err, res) {
			callback(err);
		});
	};
	
	this.message = function(type, args) {
		msg_type = type;
		var method = def_order[msg_type];
		
		if(method) {
			args.path = getPath(args.path);
			
			if(type != 'upload') {
				procFtpAuth(function(err, res) {
					eval(method + "(args);");
				});
			} else {
				eval(method + "(args);");
			}
		}
	}
	
	this.end = function() {
		ftp.destroy();
	}
	
	/**
	 * private method, related ftp
	 * 
	 */
	function procFtpAuth(callback) {
		 ftp.auth(def_opts.user, def_opts.passwd, function(err, res) {
		 	callback(err, res);
		 });
	}
	
	function procFtpList(args) {
		ftp.ls(args.path, function(err, data) {
			var result = [];
			
			if(args.nodeType == -1) { // nodeType, -1(모두), 0(파일), 1(폴더)
				result = data;
			} else {
				for(var i in data) {
					if(data[i].type == args.nodeType) { 
						result.push(data[i]);
					}
				}
			}
			
            sendMessage(err, args, { nodeList: result });
        });
	}
	
    function procFtpUpload(args) {
    	if(args.order == 'check') {
    		procFtpList(args);
    	} else {
	    	var commonArg = { order: args.order, fileIndex: args.fileIndex, fileSize: args.fileSize };
	    	
	    	if(args.order == 'start') {
	    		uploadBlobList = [];
	    		sendMessage(null, args, commonArg);
	    	}
	    	
	        if(args.order == 'ing') {
	        	uploadBlobList[args.blobIndex] = args.fileBlob;
	        	sendMessage(null, args, _.extend(commonArg, { blobIndex: args.blobIndex, blobSize: uploadBlobList[args.blobIndex].length }));
	        }
	        
	        if(args.order == 'end') {
	        	procFtpAuth(function() {
		            ftp.put((args.path + "/" + args.fileName), new Buffer(uploadBlobList.join(''), 'binary'), function(err, res) {
		                sendMessage(err, args, commonArg);
		            });
				});
	        }
		}
	}
	
	function procFtpDownload(args) {
		if(args.order == "start") {
			ftp.get(args.path + "/" + args.fileName, function(err, data) {
	        	downloadBlobList = getPacketList(data);
	        	
	        	onSendBlob(-1);
	        });
		}
       
		if(args.order == "ing") {
       		onSendBlob(args.blobIndex);
		}
       
		function onSendBlob(index) {
        	sendMessage(null, args, { 
    			fileIndex: args.fileIndex,
    			blobIndex: index, 
    			blobSize: downloadBlobList.length,
    			data: (index > -1) ? downloadBlobList[index] : null
    		});
        }
	}
	
	function procFtpRename(args) {
		var fromPath = getPath(args.fromPath),
			toPath = getPath(args.toPath);
			
		ftp.rename(fromPath, toPath, function(err, data) {
			sendMessage(err, args);
        });
	}
	
	function procFtpMkdir(args) {
		ftp.raw.mkd(args.path, function(err, data) {
			sendMessage(err, args);
        });
	}
	
	function procFtpRmdir(args) {
		ftp.raw.rmd(args.path, function(err, data) {
			sendMessage(err, args);
        });
	}
	
	function procFtpDelete(args) {
		ftp.raw.dele(args.path, function(err, data) {
			sendMessage(err, args, { p_path: args.p_path, name: args.name });
        });
	}

	function procFtpRead(args) {
       ftp.get(args.path, function(err, data) {
	       var result = getPacketList(data);
	       
	       sendMessage(err, args, { 
				data: result.join(""), 
				name: args.name, 
				ext: args.ext, 
				is_img: args.is_img, 
				is_syn: args.is_syn
			});
		});
		/**/
	}
	
	/**
	 * private method, related utility
	 * 
	 */
	function getDataBuffer(fileBlob) {
        var base64Data = fileBlob.replace(/^data:.+\/(.+);base64,/,"");
        
        return new Buffer(base64Data, 'base64');
    }
    
    function getPath(path) {
    	var result = def_opts.d_path + ((path != undefined) ? path : "");
			
		// 마지막 글짜 '/' 제거
		if(result.substring(result.length - 1, result.length) == "/") 
			result = result.substring(0, result.length - 1);
    	
    	return result;
    }
    
    function sendMessage(err, args, result) {
    	var def_info = { order: args.order };
    	
    	if(err) {
            result = _.extend(def_info, { isError: true });
	  		
	  		console.log("-------------------------------");
	  		console.log(err);
	  		console.log("-------------------------------");
	  	}
	  	else	
            result = _.extend(def_info, result);
	  	
    	socket.emit(msg_type, result);
    }
    
    function getPacketList(buffer) {
    	var blob = buffer.toString("base64");
	    var sliceSize = def_opts.p_size * 1024;
	    
	    var sliceCount = Math.ceil(blob.length / sliceSize);
	    var pList = [];
	    
	    for(var i = 0; i < sliceCount; i++) {
	        var start = i * sliceSize;
	        var end = Math.min((i + 1) * sliceSize, blob.length);
	        
	        var tmp_blob = blob.substring(start, end);
	        pList.push(tmp_blob);
	    }
	    
	    return pList;
	}
}