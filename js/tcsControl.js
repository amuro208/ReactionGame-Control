	var tcsControl = {}

	tcsControl.curUserIndex = 0;
	tcsControl.tmpCurIndex = -1;
	tcsControl.totalUser = 0;
  tcsControl.tw;
	tcsControl.cw;


	tcsControl.init = function(){
		document.addEventListener("onSocketMessage",this.onSocketMessage);
		document.addEventListener('mouseup',tcsControl.scrollEnd,false);
		document.addEventListener('touchend',tcsControl.scrollEnd,false);
		$$("userlist").addEventListener('mousedown', tcsControl.scrollStart,false);
		$$("userlist").addEventListener('touchstart', tcsControl.scrollStart,false);
		$$("userlist").addEventListener('mousemove',tcsControl.scrolling,false);
		$$("userlist").addEventListener('touchmove',tcsControl.scrolling,false);
		$$("btn-ready").disabled = true;

		this.getUserData();

		  $$("tmpLog").innerHTML = window.innerWidth+":"+window.innerHeight;
	}

	tcsControl.onSocketMessage = function(e){
		if(e.detail.cmd == "USERDATA"){
			tcsControl.addUserData(e.detail.msg);
			log("onSocketMessage : "+e.detail.msg);
			var nqueue = tcsControl.getNumberInQueue();
			tcssocket.send("ALL","USERDATA_RECEIVED",nqueue);
		}
	}

	tcsControl.getUserData = function(){

		if (typeof(Storage) !== "undefined") {
			var storedData = localStorage.getItem("userqueues");
			console.log("storedData : "+storedData);
			if(storedData != null){
				udata = JSON.parse(storedData);
			}
		}
		console.log("udata.userqueues.length : "+udata.userqueues.length+"/"+$$("thumbContainerWrapper").children.length);
		tcsControl.totalUser = udata.userqueues.length;

		for(var i = 0;i<udata.userqueues.length;i++){
			if(udata.userqueues[i] == null){
				delete udata.userqueues[i];
				console.log("null in user data" + i +"/"+udata.userqueues.length);
			}else{
				tcsControl.addThumbnail(udata.userqueues[i]);
			}

		}
		tcsControl.currentIndex();
		tcsControl.thumbnailOrdering();
		tcsControl.displayStatus();
	}

/* SCROLL */
	tcsControl.isScrolling = false;
	tcsControl.mouseDown = false;
	tcsControl.scrollPrevX = 0;
	tcsControl.scrollSpeed = 0;

	tcsControl.scrollStart = function(e){
		var p = pointerEventToXY(e);
		tcsControl.scrollPrevX = p.x;
		tcsControl.mouseDown = true;
		tcsControl.displayStatus();
	}
	tcsControl.scrollEnd = function(e){
		if(tcsControl.mouseDown && tcsControl.isScrolling){
			tcsControl.calculateCurrentIndex();
		}
		tcsControl.isScrolling = false;
		tcsControl.mouseDown = false;
		tcsControl.displayStatus();
	}
	tcsControl.scrolling = function(e){
		if( tcsControl.mouseDown){
		tcsControl.isScrolling = true;
		tcsControl.displayStatus();
		var p = pointerEventToXY(e);
		tcsControl.scrollSpeed = p.x-tcsControl.scrollPrevX;
		tcsControl.scroll(tcsControl.scrollSpeed);
		tcsControl.scrollPrevX = p.x;
	}}

	tcsControl.scroll = function(n){
		var l = parseInt($$("thumbContainerWrapper").style.left) ;
			$$("thumbContainerWrapper").style.left = l+n+"px";
	}

	tcsControl.cancel = function(){
		paging(0);
	}




	tcsControl.getNumberInQueue = function(){
		var q = 0;
			for(var i = 0;i<udata.userqueues.length;i++){
				if(udata.userqueues[i].status == 1){
					q++;
				}
			}
			return q;
	}
	tcsControl.resetQueue = function(){

			for(var i = 0;i<udata.userqueues.length;i++){
				this.deleteThumbnail(udata.userqueues[i]);
	  	}
			udata.userqueues = [];
			this.totalUser = 0;
			this.currentIndex();
			this.saveUserData();
			this.displayStatus();
	}
	tcsControl.clearBoard = function(){

	}
	tcsControl.deleteThumbnail = function(obj){
		if(obj && obj.thumb){
			$$("thumbContainerWrapper").removeChild(obj.thumb);
		}
		var cn = $$("thumbContainerWrapper").children;
		$$("thumbContainerWrapper").style.width = cn.length*244+"px";
	}

	tcsControl.addThumbnail = function(obj){
		log("addThumbnail : "+udata.userqueues.length);
			var thumb = document.createElement("DIV");

			//thumb.add
			if(obj != null){
				//userFirstName,userLastName,userEmail,userFlag,userMobile,userPostcode,userOption1,userOption2
				var fnames = obj.userFirstName.split("|");
				var lnames = obj.userLastName.split("|");
				var flags = obj.userFlag.split("|");

				if(multiUser==2){
					var nStr1 = "<input type='text' class='uname noselect' readonly='true' value="+fnames[0]+"><input type='text' class='uname noselect' readonly='true' value="+lnames[0]+">";
					var fStr1 = "<img src = './img/flags/flag"+(parseInt(flags[0])+1)+".png'/>";
					if(fnames[0] == undefined || fnames[0] == "" || parseInt(flags[0])<0){
						nStr1 = "<input type='text' class='uname noselect ' readonly='true' value='CPU'>";

					}
					var nStr2 = "<input type='text' class='uname noselect' readonly='true' value="+fnames[1]+"><input type='text' class='uname noselect' readonly='true' value="+lnames[1]+">";
					var fStr2 = "<img src = './img/flags/flag"+(parseInt(flags[1])+1)+".png'/>";
					if(fnames[1] == undefined || fnames[1] == "" || parseInt(flags[1])<0){
						nStr2 = "<input type='text' class='uname noselect' readonly='true' value='CPU'>";

					}

					if(this.useFlag == false){
						//fStr1 = "";
						//fStr2 = "";
					}
					// <div class='overlay'></div>
					thumb.innerHTML = "\
					<div class='overlay'></div>\
					<div class='inner-multi'>\
					<div class='flag-multi'>"+fStr1+"</div>\
					<div class='name-multi'>"+nStr1+"</div>\
					</div>\
					<div class='line'></div>\
					<div class='inner-multi'>\
					<div class='flag-multi'>"+fStr2+"</div>\
					<div class='name-multi'>"+nStr2+"</div>\
					</div>";


				}else{
					var nStr1 = "<input type='text' class='uname noselect' readonly='true' value="+fnames[0]+"><input type='text' class='uname noselect' readonly='true' value="+lnames[0]+">";
					var fStr1 = "<img src = './img/flags/flag"+(parseInt(flags[0])+1)+".png'/>";
					if(fnames[0] == undefined || fnames[0] == "" || parseInt(flags[0])<0){
						nStr1 = "<input type='text' class='uname noselect' readonly='true' value='CPU'>";

					}
					thumb.innerHTML = "\
					<div class='overlay'></div>\
					<div class='inner-single'>\
					<div class='flag-single'>"+fStr1+"</div>\
					<div class='name-single'>"+nStr1+"</div>\
					</div>";
				}

				 obj.thumb = thumb;
				 this.thumbnailStyle(thumb,thumbStyles[obj.status]);

			}else{
				 this.thumbnailStyle(thumb,"normal");
			}

			$$("thumbContainerWrapper").appendChild(thumb);
			var cn = $$("thumbContainerWrapper").children;
			$$("thumbContainerWrapper").style.width = cn.length*244+"px";

			this.thumbnailOrdering();
			this.displayStatus();
			log("thumbContainerWrapper : "+$$("thumbContainerWrapper").style.left+" :: "+cn.length);

	}

	tcsControl.thumbnailStyle = function(thumb,style){
			     if(style == "normal") {thumb.className = "thumb-item";}
			else if(style == "active") {thumb.className = "thumb-item thumb-item-active";}
			else if(style == "dimmed") {thumb.className = "thumb-item thumb-item-dimmed";}
			else if(style == "skipped"){thumb.className = "thumb-item thumb-item-skipped";}
		}
	tcsControl.thumbnailOrdering = function(){
		if(this.curUserIndex>-1 && this.curUserIndex<udata.userqueues.length){
			var centerThumb = udata.userqueues[this.curUserIndex].thumb;
			var thumbX     = centerThumb.offsetLeft;
			var thumbWidth = centerThumb.offsetWidth;
			var containerWidth = $$("thumbContainer").offsetWidth;
			var wrapperWidth = $$("thumbContainerWrapper").offsetWidth;

			for(var i = 0;i<udata.userqueues.length;i++){
				var thumb = udata.userqueues[i].thumb;
				if(thumb){
					if(thumb == centerThumb){
						this.thumbnailStyle(thumb,"active");
					}else{
						console.log("udata.userqueues[i].status : "+udata.userqueues[i].status+"::"+thumbStyles[udata.userqueues[i].status]);
						 this.thumbnailStyle(thumb,thumbStyles[udata.userqueues[i].status]);
					}
				}

			}


			//$$("curUserArrow").style.left = ($$("userlist").offsetWidth-2)/2+"px";
			//TweenMax.to($$("thumbContainer"),0.3,{scrollLeft:(thumbX+thumbWidth/2)-(containerWidth-2)/2,ease:Power2.easeInOut});
			TweenMax.to($$("thumbContainerWrapper"),0.5,{left:-(thumbX-20)+"px",ease:Power2.easeOut});
			//$$("thumbContainer").scrollLeft  = 100;//boxWidth/2-(thumbX+thumbWidth/2);
			//console.log("nodeX :: "+this.curUserIndex+":"+thumbX+":"+thumbWidth+":"+containerWidth+"/"+wrapperWidth+":"+$$("thumbContainer").scrollLeft);
			//TweenMax.to($$("thumbContainer"),0.5,{scrollLeft:(thumbX+thumbWidth/2)-boxWidth/2,ease:Power2.easeInOut});
			//TweenMax.to($$("thumbContainer"),0.3,{scrollLeft:(thumbX+thumbWidth/2)-(containerWidth-2)/2,ease:Power2.easeInOut});
		}
	}


	tcsControl.calculateCurrentIndex = function(){
		var l = parseInt($$("thumbContainerWrapper").style.left) ;
		this.curUserIndex = Math.floor(((l+this.scrollSpeed*5)*-1+122)/244);
		//console.log("this.curUserIndex : "+this.curUserIndex);
		if(isNaN(this.curUserIndex))this.curUserIndex = 0;

		if(this.curUserIndex>=udata.userqueues.length){
			this.curUserIndex=udata.userqueues.length-1;
		}
		if(this.curUserIndex<0)this.curUserIndex = 0;
		//	console.log("this.curUserIndex 2 : "+this.curUserIndex);
		this.thumbnailOrdering();
		this.displayStatus();

	}
	tcsControl.scrollToUser = function(n){

			this.curUserIndex = this.curUserIndex+n;
			if(this.curUserIndex<0)this.curUserIndex = 0;
			if(this.curUserIndex>=udata.userqueues.length)this.curUserIndex=udata.userqueues.length-1;
			if(n==0){
				this.currentIndex();
			}
			this.thumbnailOrdering();
			this.displayStatus();

	}
	tcsControl.displayStatus = function(){
		if(this.totalUser>0)$$("btn-ready").disabled = false;
		$$("udataStatus").innerHTML = "current user : "+this.curUserIndex+"/"+this.totalUser;
		$$("scrollStatus").innerHTML = "scrolling : "+tcsControl.isScrolling+" x:"+tcsControl.scrollPrevX;
	}
	tcsControl.userStatus = function(){
		var cntPassed = 0;
		var needToDelete = -1;
		var obj;
		for(var i=0;i<udata.userqueues.length;i++){
			obj = udata.userqueues[i];
			if(i < this.tmpCurIndex && obj.status == 0){
				obj.status = 1;
				this.thumbnailStyle(obj.thumb,"skipped");
			}
			if(obj.status == 2){
				//take the oldest one to delete
				if(needToDelete<0)needToDelete = i;
				//count number played
				cntPassed++;
			}
		}
		obj = udata.userqueues[this.tmpCurIndex];
		obj.status = 2;
		this.thumbnailStyle(obj.thumb,"dimmed");
		this.tmpCurIndex = -1;

		if(cntPassed>15 && needToDelete>-1){

			//this.deleteThumbnail(udata.userqueues[needToDelete]);
			//delete udata.userqueues[needToDelete];

		}
		this.saveUserData();
		this.currentIndex();
		this.thumbnailOrdering();
		this.displayStatus();
	}

	tcsControl.currentUserSetting = function(){
		/*trace(xml);
		//UserData.users[0].choosenFlag = int(xml.flag);
		UserData.users[0].userFirstName = xml.fname;
		UserData.users[0].userLastName = xml.lname;
		UserData.users[0].userEmail = xml.email;
		UserData.users[0].dropOption = xml.option;
		UserData.users[0].userEDMTNC = xml.terms;
		trace("currentUser : "+UserData.users[0].userFirstName+"  "+UserData.users[0].userLastName+" "+UserData.users[0].userEDMTNC);
		*/

	}


	tcsControl.currentIndex = function(){
			this.curUserIndex = this.totalUser-1;
			for(var i=0;i<udata.userqueues.length;i++){
				if(udata.userqueues[i].status == 0){
					this.curUserIndex = i;
					break;
				}
			}
			if(this.curUserIndex<0)this.curUserIndex = 0;
		}
	tcsControl.addUserData = function(info){
			var uinfos = info.split(",");
			var uobj = {"status":0,"userFirstName":uinfos[0],"userLastName":uinfos[1],"userEmail":uinfos[2],"userFlag":uinfos[3],"userMobile":uinfos[4],"userPostcode":uinfos[5],"userOption1":uinfos[6],"userOption2":uinfos[7],"thumb":null};
			udata.userqueues.push(uobj);
			this.saveUserData();
			this.totalUser = udata.userqueues.length;
			this.addThumbnail(uobj);
			if(this.currentpage == 1){
				this.currentIndex();
				this.thumbnailOrdering();
			}
			this.displayStatus();
	}
  tcsControl.saveUserData = function(){
		var jstr = JSON.stringify(udata);
		localStorage.setItem("userqueues", jstr );
	}



  //getAjax('http://foo.bar/?p1=1&p2=Hello+World', function(data){ console.log(data); });
	// example request
	//postAjax('http://foo.bar/', 'p1=1&p2=Hello+World', function(data){ console.log(data); });

	// example request with data object
	//postAjax('http://foo.bar/', { p1: 1, p2: 'Hello World' }, function(data){ console.log(data); });
