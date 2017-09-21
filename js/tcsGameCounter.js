	var tcsGameCounter = {}


	tcsGameCounter.init = function(){
		document.addEventListener("onSocketMessage",this.onSocketMessage);
	}

	tcsGameCounter.onSocketMessage = function(e){
		if(e.detail.cmd == "USERDATA"){
			//tcsControl.addUserData(e.detail.msg);
			//log("onSocketMessage : "+e.detail.msg);
			//var nqueue = tcsControl.getNumberInQueue();
			//tcssocket.send("ALL","USERDATA_RECEIVED",nqueue);
		}else if(e.detail.cmd == "GAME_END"){

		}

	}

	tcsGameCounter.cancel = function(){
		//paging(0);
	}


	tcsGameCounter.userReady = function(){

	}
