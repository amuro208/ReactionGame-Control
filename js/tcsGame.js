	var tcsGame = {}


	tcsGame.photoId = "";
	tcsGame.videoId = "";

	tcsGame.init = function(){
		document.addEventListener("onSocketMessage",this.onSocketMessage);
	}

	tcsGame.onSocketMessage = function(e){
		if(e.detail.cmd == "USERDATA"){
			//tcsControl.addUserData(e.detail.msg);
			//log("onSocketMessage : "+e.detail.msg);
			//var nqueue = tcsControl.getNumberInQueue();
			//tcssocket.send("ALL","USERDATA_RECEIVED",nqueue);
		}else if(e.detail.cmd == "GAME_END"){
				$$("btn-approve").disabled = false;
		}

	}

	tcsGame.cancel = function(){
		paging(0);
	}


	tcsGame.userReady = function(){
		if(tcsControl.curUserIndex>-1 && tcsControl.totalUser>0){
			tcsControl.tmpCurIndex  = tcsControl.curUserIndex;
			userData = udata.userqueues[tcsControl.curUserIndex];

			this.photoId = "user_"+new Date().getTime();
			this.videoId = "user_"+new Date().getTime();

			var fnames = userData.userFirstName.split("|");
			var lnames = userData.userLastName.split("|");
			var emails = userData.userEmail.split("|");
			var flags = userData.userFlag.split("|");

			console.log("fnames[0] : "+fnames[0]);

			if(fnames[1] == "")console.log("fnames[1] : "+fnames[1]);


			var fStr1 = "<img src = './img/flags/flag"+(parseInt(flags[0])+1)+".png'/>";
      var fStr2 = "<img src = './img/flags/flag"+(parseInt(flags[1])+1)+".png'/>";

			if(multiUser == 2){

			}else{

			}

			var un1 = emails[0] == ""?"CPU":fnames[0]+" "+lnames[0];
			var un2 = emails[1] == ""?"CPU":fnames[1]+" "+lnames[1];
			$$("userGame1").innerHTML = "<div class='thumb-item-inner-single'><div class='thumb-item-flag-single'>"+fStr1+"</div><div>"+un1+"</div></div>";
			//$$("userGame2").style.display= "none";
			$$("userGame2").innerHTML = "<div class='thumb-item-inner-single'><div class='thumb-item-flag-single'>"+fStr2+"</div><div>"+un2+"</div></div>";

			tcssocket.send("ALL","READY",un1+","+flags[0]+","+this.photoId+"|"+un2+","+flags[1]+","+this.photoId+"#EOF");
			paging(1);

			$$("btn-cancel").disabled = false;
			$$("btn-approve").disabled = true;
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

		if(s == "ball"){
			//this.activeBtn($$("btnCtrl1"),true);

		TweenMax.from($$("btnCtrlBall"), 1, {top:"-30px", ease:Bounce.easeOut});
		$$("btnCtrlBall").style.filter = "drop-shadow(0px 5px 10px #000)";
    $$("btnCtrlRnd").style.filter = "saturate(0)";

			tcssocket.send("ALL","BALL_READY","-");
		}else if(s == "again"){
			tcssocket.send("ALL","RETRY","");
		}else if(s == "level"){
			tcssocket.send("ALL","MODE","NORMAL");
		}else if(s == "fake"){
			tcssocket.send("ALL","KICK_TRACKER","1.0,0,1.0");
		}

	}
  //getAjax('http://foo.bar/?p1=1&p2=Hello+World', function(data){ console.log(data); });
	// example request
	//postAjax('http://foo.bar/', 'p1=1&p2=Hello+World', function(data){ console.log(data); });

	// example request with data object
	//postAjax('http://foo.bar/', { p1: 1, p2: 'Hello World' }, function(data){ console.log(data); });

	tcsGame.onResponseXML = function(data){
		var xml = parseXml(data);
		var result = xml.getElementsByTagName("result_data")[0].childNodes[0].getAttribute("status");
		if(result == "success"){
			log("OK");
			paging(0);
			if(tcsControl.tmpCurIndex>-1){
				tcsControl.userStatus();
			}
		}else{
			alert("Error Occured : "+result);
		}
	}
	tcsGame.onResponseJSON = function(data){
		log(data);


		data = data.replace(/[\u0000-\u001F]+/g,"");
			log(data);
		var obj = JSON.parse(data);
		log(obj.result_data.result);


		var result = obj.result_data.result;
		if(result == "success"){
			log("OK");
			paging(0);
			if(tcsControl.tmpCurIndex>-1){
				tcsControl.userStatus();
			}
		}else{
			alert("Error Occured : "+result);
		}

	}
	tcsGame.approve = function(){

    var cmsURL = "http://"+conf.CMS_IP;
		var cmsEvtCode = conf.CMS_EVENT_CODE;
		var cmsUpload = conf.CMS_UPLOAD;

		userData.eventCode = cmsEvtCode;
		userData.photoId = this.photoId;
		userData.videoId = this.videoId;
		log("---------------------------");
		log("CMS url  : "+cmsURL+cmsUpload);
		log("CMS code : "+cmsEvtCode);
		for(var key in userData){
			log(key+" : "+userData[key]);
		}

		  postAjax(cmsURL+cmsUpload, userData, function(readyState,status,data){
				log("readyState : "+readyState);
				log("status : "+status);
				log("data : "+data);
				if(readyState == 4){
						if(status == 200){
								tcsGame.onResponseJSON(data);
						}else if(status == 404){
							  alert("Page Not Found");
							  log("404");
						}else if(status == 500){
							  alert("Server Error");
								log("500");
						}
				}
			});
	}
