	var tcsGameCounter = {}


	tcsGameCounter.init = function(){
		document.addEventListener("onSocketMessage",this.onSocketMessage);
	}

	tcsGameCounter.userScore = 0;
	tcsGameCounter.onSocketMessage = function(e){
		console.log("onSocketMessage :: "+e.detail.cmd +":"+e.detail.msg);
		if(e.detail.cmd == "READY"){
			isGameReady = true;
			tcsGameCounter.userScore = 0;
			tcsGameCounter.display();
			paging(1);

		}else if(e.detail.cmd == "START"){
			isGameRunning = true;

		}else if(e.detail.cmd == "STOP" || e.detail.cmd == "GAME_COMPLETE" || e.detail.cmd == "SUBMIT_ERROR"){
			isGameRunning = false;
			isGameReady = false;
			paging(0);

		}else if(e.detail.cmd == "ADDPOINT"){
			if(!isGameRunning)return;
			tcsGameCounter.userScore++;
			tcsGameCounter.display();

		}else if(e.detail.cmd == "LOSEPOINT"){
			if(!isGameRunning)return;
			tcsGameCounter.userScore--;
			tcsGameCounter.display();

		}else if(e.detail.cmd == "TIMEOUT"){
			isGameRunning = false;

		}


	}

	tcsGameCounter.display = function(){
		var scoreStr = tcsGameCounter.userScore<10?"0"+tcsGameCounter.userScore:""+tcsGameCounter.userScore;
		$$("cnt1").innerHTML = scoreStr.charAt(0);
		$$("cnt2").innerHTML = scoreStr.charAt(1);
	}
	tcsGameCounter.cancel = function(){
		//paging(0);
	}
	tcsGameCounter.addScore = function(){
		paging(1);
		tcsGameCounter.userScore++;
		tcsGameCounter.display();
	}

	tcsGameCounter.userReady = function(){

	}
