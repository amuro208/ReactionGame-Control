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

		this.getUserDataFromLocalStorage();


		//  $$("tmpLog").innerHTML = window.innerWidth+":"+window.innerHeight;
	}

	tcsControl.onSocketMessage = function(e){
		if(e.detail.cmd == "USERDATA"){
			tcsControl.addUserData(e.detail.msg);
			log("onSocketMessage : "+e.detail.msg);
			var nqueue = tcsControl.getNumberInQueue();
			tcssocket.send("ALL","USERDATA_RECEIVED",nqueue);
		}
	}

	tcsControl.getUserDataFromLocalStorage = function(){
		if (typeof(Storage) !== "undefined") {
			var storedData = localStorage.getItem("userqueues");
			tcsControl.initUserQueueWithData(storedData);
		}
	}
	tcsControl.getUserDataFromServer = function(){
 	 if(confirm("Are you sure you want to bring user queues from server?")){
 		 tcsControl.deleteQueue(false);
 		 var cmsURL = "http://"+conf.CMS_IP+conf.CMS_REQUEST_QUEUE;
		 log("getUserDataFromServer : "+cmsURL);
 			 postAjax(cmsURL, {}, function(readyState,status,data){
 				 log("readyState : "+readyState);
 				 log("status : "+status);
 				 if(readyState == 4){
 						 if(status == 200){
 								 //log("data : "+data);
 								 tcsControl.initUserQueueWithData(data);
 								 tcsControl.saveQueueAtLocalStorage();
 						 }else if(status == 404){
 								 alert("404 Page Not Found");
 						 }else if(status == 500){
 								 alert("500 Internal Server Error");
 						 }else{
 								 alert("Unknown Error");
 						 }
 				 }
 			 });
 	 }
  }
	tcsControl.initUserQueueWithData = function(data){
		console.log("userData : "+data);
		if(data != null){
			udata = JSON.parse(data);
			console.log("udata.userqueues.length : "+udata.userqueues.length+"/"+$$("thumbContainerWrapper").children.length);
			for(var i = 0;i<udata.userqueues.length;i++){
				if(udata.userqueues[i] == null){
					udata.userqueues.splice(i,1);
					console.log("null in user data" + i +"/"+udata.userqueues.length);
				}else{
					tcsControl.addThumbnail(udata.userqueues[i]);
				}
			}
			tcsControl.totalUser = udata.userqueues.length;
			tcsControl.setCurUserIndex();
			tcsControl.thumbnailOrdering();
			tcsControl.displayStatus();
		}
	}


	tcsControl.cancel = function(){
		paging(0);
	}

	tcsControl.saveQueueAtServer = function(){
		var cmsURL = "http://"+conf.CMS_IP+conf.CMS_SAVE_QUEUE;
		log("saveQueueAtServer : "+cmsURL);
		var obj = {};
		obj.userQueues = JSON.stringify(udata);
			postAjax(cmsURL, obj, function(readyState,status,data){
				log("readyState : "+readyState);
				log("status : "+status);
				log("data : "+data);
				if(readyState == 4){
						if(status == 200){
								//alert("User queues saved!");
						}else if(status == 404){
							  alert("404 Page Not Found");
						}else if(status == 500){
								alert("500 Internal Server Error");
						}else{
								alert("Unknown Error");
						}
				}
			});
	}
	tcsControl.saveQueueAtLocalStorage = function(){
		var jstr = JSON.stringify(udata);
		console.log("saveUserData on local storage : "+jstr);
		localStorage.setItem("userqueues", jstr );
	}

	tcsControl.deleteQueue = function(chk){
		var bool = true;
		if(chk){
			bool = confirm("Are you sure you want to delete user queues?");
		}

		if(bool){
			for(var i = 0;i<udata.userqueues.length;i++){
				this.deleteThumbnail(udata.userqueues[i]);
	  	}
			udata.userqueues = [];
			this.totalUser = 0;
			this.setCurUserIndex();
			this.saveQueueAtLocalStorage();
			this.displayStatus();
		}
	}

	tcsControl.clearBoard = function(){
		if(confirm("Are you sure you want to reset this leader board?")){
			var cmsURL = "http://"+conf.CMS_IP+conf.CMS_CLEAR_BOARD;
			log("clearBoard : "+cmsURL);
				postAjax(cmsURL, {}, function(readyState,status,data){
					log("readyState : "+readyState);
					log("status : "+status);
					log("data : "+data);
					if(readyState == 4){
							if(status == 200){
								tcssocket.send("ALL","BOARD_CLEARD","-");
								// var xml = parseXml(data);
								// console.log("onResponseXML :: "+data);
								// var result = xml.getElementsByTagName("result_data")[0].childNodes[0].getAttribute("status");
								// if(result == "success"){
								// 	tcssocket.send("ALL","BOARD_CLEARD","-");
								// }
							}else if(status == 404){
									//tcsGame.submitErrorHandler("404 Page Not Found");
							}else if(status == 500){
									//tcsGame.submitErrorHandler("500 Internal Server Error");
							}else{
									//tcsGame.submitErrorHandler("Unknown Error");
							}
					}
				});
		}
	}

	tcsControl.addUserData = function(info){
			var uinfos = info.split(",");
			var uobj = {"status":0,"userFirstName":uinfos[0],"userLastName":uinfos[1],"userEmail":uinfos[2],"userFlag":uinfos[3],"userMobile":uinfos[4],"userPostcode":uinfos[5],"userOption1":uinfos[6],"userOption2":uinfos[7],"userOption3":uinfos[8],"thumb":null};
			udata.userqueues.push(uobj);
			this.saveQueueAtServer();
			this.saveQueueAtLocalStorage();
			this.totalUser = udata.userqueues.length;
			this.addThumbnail(uobj);
			if(this.currentpage == 1){
				this.setCurUserIndex();
				this.thumbnailOrdering();
			}
			this.displayStatus();
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
						 //console.log("udata.userqueues[i].status : "+udata.userqueues[i].status+"::"+thumbStyles[udata.userqueues[i].status]);
						 this.thumbnailStyle(thumb,thumbStyles[udata.userqueues[i].status]);
					}
				}

			}
			TweenMax.to($$("thumbContainerWrapper"),0.5,{left:-(thumbX-20)+"px",ease:Power2.easeOut});
		}
	}



	tcsControl.scrollToUser = function(n){

			this.curUserIndex = this.curUserIndex+n;
			if(this.curUserIndex<0)this.curUserIndex = 0;
			if(this.curUserIndex>=udata.userqueues.length)this.curUserIndex=udata.userqueues.length-1;
			if(n==0){
				this.setCurUserIndex();
			}
			this.thumbnailOrdering();
			this.displayStatus();

	}
	tcsControl.displayStatus = function(){
		this.totalUser = udata.userqueues.length;
		if(this.totalUser>0)$$("btn-ready").disabled = false;
		$$("udataStatus").innerHTML = "current user : "+(this.curUserIndex+1)+"/"+this.totalUser;
		$$("scrollStatus").innerHTML = "scrolling : "+tcsControl.isScrolling+" x:"+tcsControl.scrollPrevX;
	}

	tcsControl.userStatus = function(){
    if(this.tmpCurIndex>-1){
				var cntPassed = 0;
				var needToDelete = -1;
				var obj;
				for(var i=0;i<udata.userqueues.length;i++){
					obj = udata.userqueues[i];
					if(i < this.tmpCurIndex && obj.status == 0){
						obj.status = 1;
						this.thumbnailStyle(obj.thumb,"skipped");
					}
					if(i == this.tmpCurIndex){
						obj.status = 2;
						this.thumbnailStyle(obj.thumb,"dimmed");
					}
					if(obj.status == 2){
						if(needToDelete<0)needToDelete = i;
						cntPassed++;
					}
				}

				this.tmpCurIndex = -1;
				if(cntPassed>20 && needToDelete>-1){
					this.deleteThumbnail(udata.userqueues[needToDelete]);
					udata.userqueues.splice(needToDelete,1);
				}
				this.totalUser = udata.userqueues.length;
				this.saveQueueAtLocalStorage();
				this.setCurUserIndex();
				this.thumbnailOrdering();
				this.displayStatus();

		}
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
			tcsControl.calIndexInMiddle();
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



	tcsControl.currentUserSetting = function(){

	}
	tcsControl.calIndexInMiddle = function(){
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

	tcsControl.setCurUserIndex = function(){
			this.curUserIndex = this.totalUser-1;
			for(var i=0;i<udata.userqueues.length;i++){
				if(udata.userqueues[i] && udata.userqueues[i].status == 0){
					this.curUserIndex = i;
					break;
				}
			}
			if(this.curUserIndex<0)this.curUserIndex = 0;
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


  //getAjax('http://foo.bar/?p1=1&p2=Hello+World', function(data){ console.log(data); });
	// example request
	//postAjax('http://foo.bar/', 'p1=1&p2=Hello+World', function(data){ console.log(data); });

	// example request with data object
	//postAjax('http://foo.bar/', { p1: 1, p2: 'Hello World' }, function(data){ console.log(data); });
