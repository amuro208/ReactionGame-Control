
	var PageGame = function(id){
		Page.call(this,id);
		this.photoId = "";
		this.videoId = "";
		this.totalTime = 30.0;
		this.timeRemain = 0;
		this.userScore = 0;;
		this.timerId;
		this.prevTime;
	}

	PageGame.prototype = Object.create(Page.prototype);
	PageGame.prototype.constructor = PageGame;
	PageGame.prototype.init = function(){
		document.addEventListener("onSocketMessage",this.onSocketMessage.bind(this),false);
	}

	PageGame.prototype.onSocketMessage = function(e){
		if(e.detail.cmd == "TIMEOUT"){


		}else if(e.detail.cmd == "START"){
			if(this.timerId)clearInterval(this.timerId);
			this.prevTime = new Date().getTime();
			this.timerId = setInterval(this.calculateTime,30);

		}else if(e.detail.cmd == "ADDPOINT"){
			this.userScore++;
			this.display();

		}else if(e.detail.cmd == "GIF_DONE"){
			$$("btn-approve").disabled = false;
			if(conf.infiniteTest == "Y"){
				this.approve();
			}

		}
	}

	PageGame.prototype.cancel = function(){
		if(confirm("Are you sure you want to cancel this game?")){
			app.paging(0);
			if(this.timerId)clearInterval(this.timerId);
			app.tcssocket.send("ALL","STOP","-");
		}
	}


	PageGame.prototype.userReady = function(){
		if(plist.curUserIndex>-1 && plist.totalUser>0){

			$$("log").innerHTML = "";

			plist.tmpCurIndex  = plist.curUserIndex;
			this.userData = app.udata.userqueues[plist.curUserIndex];

			this.photoId = "user_"+new Date().getTime();
			this.videoId = "user_"+new Date().getTime();

			var fnames = userData.userFirstName.split("|");
			var lnames = userData.userLastName.split("|");
			var emails = userData.userEmail.split("|");
			var flags  = userData.userFlag.split("|");
			var levels  = userData.userOption1.split("|");
			console.log("fnames[0] : "+fnames[0]);

			if(fnames[1] == "")console.log("fnames[1] : "+fnames[1]);


			var fStr1 = "<img src = './img/flags/flag"+(parseInt(flags[0]))+".png'/>";
			//var fStr2 = "<img src = './img/flags/flag"+(parseInt(flags[1])+1)+".png'/>";

			if(multiUser == 2){

			}else{

			}

			var un1 = emails[0] == ""?"CPU":fnames[0]+" "+lnames[0];
			//var un2 = emails[1] == ""?"CPU":fnames[1]+" "+lnames[1];
			$$("userGame1").innerHTML = "<div class='user-gamecard'><div class='user-gamecard-flag'>"+fStr1+"</div><div class='uname'>"+un1+(levels[0]=="true"?"*":"")+"</div></div>";
			//$$("userGame2").style.display= "none";
			//$$("userGame2").innerHTML = "<div class='thumb-item-inner-single'><div class='thumb-item-flag-single'>"+fStr2+"</div><div>"+un2+"</div></div>";

			//tcssocket.send("ALL","READY",un1+","+flags[0]+","+this.photoId+"|"+un2+","+flags[1]+","+this.photoId+"#EOF");
			app.tcssocket.send("ALL","READY",un1+","+flags[0]+","+this.photoId+","+levels[0]+"|");
			app.paging(2);

			$$("btn-cancel").disabled = false;
			$$("btn-approve").disabled = true;

			this.userScore = 0;
			if(this.timerId)clearInterval(this.timerId);
			this.timeRemain = this.totalTime*1000;
			this.display();

			$$("gameInfo").style.display = "none";
			$$("gtimeout").style.display = "none";
			$$("gtimer").style.display = "inline-block";
		  $$("gameButtons").style.display = "block";

			TweenMax.to($$("btnCtrlBall"), 0.6, {top:"0px", repeat:-1, repeatDelay:1.0, ease:Bounce.easeOut});
			$$("btnCtrlBall").style.filter = "drop-shadow(0px 5px 10px #000)";
	    $$("btnCtrlRnd").style.filter = "saturate(0)";

			if(conf.infiniteTest == "Y"){
					setTimeout(function(){
						$$("gameInfo").style.display = "inline-block";
					  $$("gameButtons").style.display = "none";
					  app.tcssocket.send("ALL","START","-");},2000);
			}
			//dispatchEvent(new PanelEvent(PanelEvent.NEXT_STEP,null,false,false));
		}else{
			alert("No user selected!");
		}
	}

  PageGame.prototype.activeBtn = function(btn,a){
		if(a)btn.classList.add("active");
		else btn.classList.remove("active");
	}


  PageGame.prototype.gameBtnControl = function(s){

		if(s == "start"){
			//this.activeBtn($$("btnCtrl1"),true);

			$$("gameInfo").style.display = "inline-block";
			$$("gameButtons").style.display = "none";
			app.tcssocket.send("ALL","START","-");

		}else if(s == "again"){
			app.tcssocket.send("ALL","RETRY","");
		}else if(s == "level"){
			app.tcssocket.send("ALL","MODE","NORMAL");
		}else if(s == "fake"){
			app.tcssocket.send("ALL","KICK_TRACKER","1.0,0,1.0");
		}

	}


	PageGame.prototype.calculateTime = function(){
		var curTime = new Date().getTime();
		this.timeRemain -= (curTime - this.prevTime);
		this.prevTime = curTime;
		if(this.timeRemain<0){
			this.timeRemain = 0;
			$$("gtimeout").style.display = "inline-block";
			$$("gtimer").style.display = "none";
			clearInterval(this.timerId);
		}
		this.display();

	}
	PageGame.prototype.display = function(){
		var tm = Math.floor(tcsGame.timeRemain/(60*1000));
		var ts  = this.timeRemain%(60*1000)/1000;
		var tms = this.timeRemain%1000;
		var tsStr = ts<10?"0"+ts:""+ts;
		var tmsStr = tms<10?"00"+tms:(tms<100?"0"+tms:""+tms);
		$$("ts1").innerHTML = tsStr.charAt(0);
		$$("ts2").innerHTML = tsStr.charAt(1);
		$$("tms1").innerHTML = tmsStr.charAt(0);
		$$("tms2").innerHTML = tmsStr.charAt(1);
		$$("tms3").innerHTML = tmsStr.charAt(2);

		var scoreStr = this.userScore<10?"0"+this.userScore:""+this.userScore;
		$$("cnt1").innerHTML = scoreStr.charAt(0);
		$$("cnt2").innerHTML = scoreStr.charAt(1);

	}

  //getAjax('http://foo.bar/?p1=1&p2=Hello+World', function(data){ console.log(data); });
	// example request
	//postAjax('http://foo.bar/', 'p1=1&p2=Hello+World', function(data){ console.log(data); });

	// example request with data object
	//postAjax('http://foo.bar/', { p1: 1, p2: 'Hello World' }, function(data){ console.log(data); });

	PageGame.prototype.onResponseXML = function(data){
		var xml = parseXml(data);
		log("onResponseXML :: "+data);
		var result = xml.getElementsByTagName("result_data")[0].childNodes[0].getAttribute("status");
		if(result == "success"){
			this.submitSuccessHandler();
		}else{
			this.submitErrorHandler(data);
		}
	}
	PageGame.prototype.submitSuccessHandler = function(){
		log("OK");
		paging(0);

		app.tcssocket.send("ALL","GAME_COMPLETE","-");
		//tcsControl.sendUserQueue();
		plist.updateUserStatus();
		if(conf.infiniteTest == "Y"){
			setTimeout(function(){this.userReady();},6000);
		}
	}
	PageGame.prototype.submitErrorHandler = function(data){
		if(confirm("Error Occured : "+data)) {
			log("ERROR");
			paging(0);
			app.tcssocket.send("ALL","SUBMIT_ERROR","-");
			//tcsControl.userStatus();
		}
	}
	PageGame.prototype.onResponseJSON = function(data){
		// log(data);
		// data = data.replace(/[\u0000-\u001F]+/g,"");
		// var obj = JSON.parse(data);
		// log(obj.result_data.result);
		// var result = obj.result_data.result;
		// if(result == "success"){
		// 	log("OK");
		// 	paging(0);
		// 	tcssocket.send("ALL","GAME_COMPLETE","-");
		// 	if(tcsControl.tmpCurIndex>-1){
		// 		tcsControl.userStatus();
		// 	}
		// }else{
		// 	alert("Error Occured : "+result);
		// }

	}
	PageGame.prototype.approve = function(){

	$$("btn-cancel").disabled = true;
	$$("btn-approve").disabled = true;

    var cmsURL = "http://"+conf.CMS_IP;
		var cmsEvtCode = conf.CMS_EVENT_CODE;
		var cmsUpload = conf.CMS_UPLOAD;
		var postObj = {};
		postObj.eventCode = cmsEvtCode;
		postObj.photoId = this.photoId;
		postObj.userEDMTNC = userData.userOption3 == "true"?"Y":"N";
		//userData.videoId = this.videoId;
		postObj.userScore = tcsGame.userScore;
		postObj.userTitle = userData.userTitle;
		postObj.userCountryId = userData.userFlag;
		postObj.userFirstName = userData.userFirstName;
		postObj.userLastName = userData.userLastName;
		postObj.userEmail = userData.userEmail;
		log("---------------------------");
		log("CMS url  : "+cmsURL+cmsUpload);
		log("CMS code : "+cmsEvtCode);

		for(var key in postObj){
			log(key+" : "+postObj[key]);
		}

		  postAjax(cmsURL+cmsUpload, postObj, function(readyState,status,data){
				log("readyState : "+readyState);
				log("status : "+status);
				log("data : "+data);
				if(readyState == 4){
						if(status == 200){
								this.onResponseXML(data);
						}else if(status == 404){
								this.submitErrorHandler("404 Page Not Found");
						}else if(status == 500){
								this.submitErrorHandler("500 Internal Server Error");
						}else{
								this.submitErrorHandler("Unknown Error");
						}
						$$("btn-cancel").disabled = false;
						$$("btn-approve").disabled = false;
				}
			}.bind(this));
	}
