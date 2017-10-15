var tcsGameTimer = {}


tcsGameTimer.init = function(){
	document.addEventListener("onSocketMessage",this.onSocketMessage);
	paging(0);
}

tcsGameTimer.totalTime = 30.0;
tcsGameTimer.timeRemain = 0;
tcsGameTimer.timerId;

isGameRunning = false;
isGameReady = false;

tcsGameTimer.onSocketMessage = function(e){
	console.log("onSocketMessage :: "+e.detail.cmd +":"+e.detail.msg);
	if(e.detail.cmd == "READY"){
		isGameReady = true;
		if(tcsGameTimer.timerId)clearInterval(tcsGameTimer.timerId);
		tcsGameTimer.timeRemain = tcsGameTimer.totalTime*1000;
		tcsGameTimer.display();
		paging(1);

	}else if(e.detail.cmd == "START"){
		if(isGameRunning)return;
		isGameRunning = true;
		if(tcsGameTimer.timerId)clearInterval(tcsGameTimer.timerId);
		tcsGameTimer.timerId = setInterval(tcsGameTimer.calculateTime,30);

	}else if(e.detail.cmd == "STOP" || e.detail.cmd == "GAME_COMPLETE" || e.detail.cmd == "SUBMIT_ERROR"){
		if(tcsGameTimer.timerId)clearInterval(tcsGameTimer.timerId);
		isGameRunning = false;
		isGameReady = false;
		paging(0);
	}

}

tcsGameTimer.cancel = function(){
	//paging(0);
}


tcsGameTimer.userReady = function(){

}

tcsGameTimer.calculateTime = function(){
	if(!isGameRunning)return;

	tcsGameTimer.timeRemain-=31;
	if(tcsGameTimer.timeRemain<0){
		tcsGameTimer.timeRemain = 0;
		tcssocket.send("ALL","TIMEOUT","-");
		isGameRunning = false;
		paging(2);
		clearInterval(tcsGameTimer.timerId);
	}else{

	}
	tcsGameTimer.display();

}
tcsGameTimer.display = function(){

	var tm = Math.floor(tcsGameTimer.timeRemain/(60*1000));
	var ts  = tcsGameTimer.timeRemain%(60*1000)/1000;
	var tms = tcsGameTimer.timeRemain%1000;

	var tsStr = ts<10?"0"+ts:""+ts;
	var tmsStr = tms<10?"00"+tms:(tms<100?"0"+tms:""+tms);
	$$("ts1").innerHTML = tsStr.charAt(0);
	$$("ts2").innerHTML = tsStr.charAt(1);
	$$("tms1").innerHTML = tmsStr.charAt(0);
	$$("tms2").innerHTML = tmsStr.charAt(1);
	$$("tms3").innerHTML = tmsStr.charAt(2);

}
