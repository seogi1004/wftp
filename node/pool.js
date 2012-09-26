module.exports = function() {
	var userList = [],
		userCount = 0;
	
	this.addUser = function(user) {
		userList.push(user);
		userCount++;
		
		showUserCount();
	}
	
	this.delUser = function(user) {
		for(var i in userList) {
			if(user.getId() == userList[i].getId()) {
				userList.splice(i, 1);
				userCount = userCount > 0 ? userCount - 1 : 0;
				
				showUserCount();
			}
		}
		
	}
	
	this.printLog = function(type, log) {
		console.log("[" + type + "] - " + new Date().toString());
		console.log(log);
		console.log("");
	}
	
	function showUserCount() {
		for(var i in userList) {
			var socket = userList[i].getSocket();
			socket.emit("total_cnt", userCount);
		}
	}
}