var tcsGameTimer = {}


tcsGameTimer.init = function(){
	document.addEventListener("onSocketMessage",this.onSocketMessage);
}

tcsGameTimer.onSocketMessage = function(e){
	if(e.detail.cmd == "USERDATA"){
		//tcsControl.addUserData(e.detail.msg);
		//log("onSocketMessage : "+e.detail.msg);
		//var nqueue = tcsControl.getNumberInQueue();
		//tcssocket.send("ALL","USERDATA_RECEIVED",nqueue);
	}else if(e.detail.cmd == "GAME_END"){

	}

}

tcsGameTimer.cancel = function(){
	//paging(0);
}


tcsGameTimer.userReady = function(){

}
