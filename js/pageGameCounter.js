var PageGameCounter = function(id){
	Page.call(this,id);
	this.userScore = 0;;
}

PageGameCounter.prototype = Object.create(Page.prototype);
PageGameCounter.prototype.constructor = PageGameCounter;
PageGameCounter.prototype.init = function(){
	document.addEventListener("onSocketMessage",this.onSocketMessage.bind(this),false);
	this.cnt1 = $$("cnt1");
	this.cnt2 = $$("cnt2");
	this.userScore = 0;
	app.isGameRunning = false;
	app.isGameReady = false;
	app.paging(0);
}


	PageGameCounter.prototype.onSocketMessage = function(e){
		console.log("onSocketMessage :: "+e.detail.cmd +":"+e.detail.msg);
		if(e.detail.cmd == "READY"){
			clearlog();
			app.isGameReady = true;
			this.userScore = 0;
			this.display();
			app.paging(1);

		}else if(e.detail.cmd == "START"){
			app.isGameRunning = true;

		}else if(e.detail.cmd == "STOP" || e.detail.cmd == "GAME_COMPLETE" || e.detail.cmd == "SUBMIT_ERROR"){
			app.isGameRunning = false;
			app.isGameReady = false;
			app.paging(0);

		}else if(e.detail.cmd == "ADDPOINT"){
			if(!app.isGameRunning)return;
			this.userScore++;
			this.display();

		}else if(e.detail.cmd == "LOSEPOINT"){
			if(!app.isGameRunning)return;
			this.userScore--;
			this.display();

		}else if(e.detail.cmd == "TIMEOUT"){
			app.isGameRunning = false;

		}
	}

	PageGameCounter.prototype.display = function(){
		var scoreStr = this.userScore<10?"0"+this.userScore:""+this.userScore;
		this.cnt1.innerHTML = scoreStr.charAt(0);
		this.cnt2.innerHTML = scoreStr.charAt(1);
	}
