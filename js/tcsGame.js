	var tcsGame = {}


	tcsGame.photoId = "";
	tcsGame.videoId = "";
	tcsGame.totalTime = 30.0;
	tcsGame.timeRemain = 0;
	tcsGame.userScore = 0;;
	tcsGame.timerId;
	tcsGame.prevTime;
	tcsGame.init = function(){
		document.addEventListener("onSocketMessage",this.onSocketMessage);
	}

	tcsGame.onSocketMessage = function(e){
		if(e.detail.cmd == "TIMEOUT"){


		}else if(e.detail.cmd == "START"){
			if(tcsGame.timerId)clearInterval(tcsGame.timerId);
			tcsGame.prevTime = new Date().getTime();
			tcsGame.timerId = setInterval(tcsGame.calculateTime,30);

		}else if(e.detail.cmd == "ADDPOINT"){
			tcsGame.userScore++;
			tcsGame.display();

		}else if(e.detail.cmd == "GIF_DONE"){
			$$("btn-approve").disabled = false;
			if(conf.infiniteTest == "Y"){
				tcsGame.approve();
			}

		}
	}

	tcsGame.cancel = function(){
		if(confirm("Are you sure you want to cancel this game?")){
			paging(0);
			if(tcsGame.timerId)clearInterval(tcsGame.timerId);
			tcssocket.send("ALL","STOP","-");
		}
	}


	tcsGame.userReady = function(){
		if(tcsControl.curUserIndex>-1 && tcsControl.totalUser>0){

			$$("log").innerHTML = "";

			tcsControl.tmpCurIndex  = tcsControl.curUserIndex;
			userData = udata.userqueues[tcsControl.curUserIndex];

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
			tcssocket.send("ALL","READY",un1+","+flags[0]+","+this.photoId+","+levels[0]+"|");
			paging(1);

			$$("btn-cancel").disabled = false;
			$$("btn-approve").disabled = true;

			tcsGame.userScore = 0;
			if(tcsGame.timerId)clearInterval(tcsGame.timerId);
			tcsGame.timeRemain = tcsGame.totalTime*1000;
			tcsGame.display();

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
					  tcssocket.send("ALL","START","-");},2000);
			}
			//dispatchEvent(new PanelEvent(PanelEvent.NEXT_STEP,null,false,false));
		}else{
			alert("No user selected!");
		}
	}

  tcsGame.activeBtn = function(btn,a){
		if(a)btn.classList.add("active");
		else btn.classList.remove("active");
	}
  tcsGame.gameBtnControl = function(s){

		if(s == "start"){
			//this.activeBtn($$("btnCtrl1"),true);

			$$("gameInfo").style.display = "inline-block";
			$$("gameButtons").style.display = "none";
			tcssocket.send("ALL","START","-");

		}else if(s == "again"){
			tcssocket.send("ALL","RETRY","");
		}else if(s == "level"){
			tcssocket.send("ALL","MODE","NORMAL");
		}else if(s == "fake"){
			tcssocket.send("ALL","KICK_TRACKER","1.0,0,1.0");
		}

	}


	tcsGame.calculateTime = function(){
		var curTime = new Date().getTime();
		tcsGame.timeRemain -= (curTime - tcsGame.prevTime);
		tcsGame.prevTime = curTime;
		if(tcsGame.timeRemain<0){
			tcsGame.timeRemain = 0;
			$$("gtimeout").style.display = "inline-block";
			$$("gtimer").style.display = "none";
			clearInterval(tcsGame.timerId);
		}
		tcsGame.display();

	}
	tcsGame.display = function(){
		var tm = Math.floor(tcsGame.timeRemain/(60*1000));
		var ts  = tcsGame.timeRemain%(60*1000)/1000;
		var tms = tcsGame.timeRemain%1000;
		var tsStr = ts<10?"0"+ts:""+ts;
		var tmsStr = tms<10?"00"+tms:(tms<100?"0"+tms:""+tms);
		$$("ts1").innerHTML = tsStr.charAt(0);
		$$("ts2").innerHTML = tsStr.charAt(1);
		$$("tms1").innerHTML = tmsStr.charAt(0);
		$$("tms2").innerHTML = tmsStr.charAt(1);
		$$("tms3").innerHTML = tmsStr.charAt(2);

		var scoreStr = tcsGame.userScore<10?"0"+tcsGame.userScore:""+tcsGame.userScore;
		$$("cnt1").innerHTML = scoreStr.charAt(0);
		$$("cnt2").innerHTML = scoreStr.charAt(1);

	}

  //getAjax('http://foo.bar/?p1=1&p2=Hello+World', function(data){ console.log(data); });
	// example request
	//postAjax('http://foo.bar/', 'p1=1&p2=Hello+World', function(data){ console.log(data); });

	// example request with data object
	//postAjax('http://foo.bar/', { p1: 1, p2: 'Hello World' }, function(data){ console.log(data); });

	tcsGame.onResponseXML = function(data){
		var xml = parseXml(data);
		log("onResponseXML :: "+data);
		var result = xml.getElementsByTagName("result_data")[0].childNodes[0].getAttribute("status");
		if(result == "success"){
			tcsGame.submitSuccessHandler();
		}else{
			tcsGame.submitErrorHandler(data);
		}
	}
	tcsGame.submitSuccessHandler = function(){
		log("OK");
		paging(0);

		tcssocket.send("ALL","GAME_COMPLETE","-");
		//tcsControl.sendUserQueue();
		tcsControl.updateUserStatus();
		if(conf.infiniteTest == "Y"){
			setTimeout(function(){tcsGame.userReady();},6000);
		}
	}
	tcsGame.submitErrorHandler = function(data){
		if(confirm("Error Occured : "+data)) {
			log("ERROR");
			paging(0);
			tcssocket.send("ALL","SUBMIT_ERROR","-");
			//tcsControl.userStatus();
		}
	}
	tcsGame.onResponseJSON = function(data){
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
	tcsGame.approve = function(){

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
								tcsGame.onResponseXML(data);
						}else if(status == 404){
								tcsGame.submitErrorHandler("404 Page Not Found");
						}else if(status == 500){
								tcsGame.submitErrorHandler("500 Internal Server Error");
						}else{
								tcsGame.submitErrorHandler("Unknown Error");
						}
						$$("btn-cancel").disabled = false;
						$$("btn-approve").disabled = false;
				}
			});
	}
