
	var PageUserList = function(id){
		Page.call(this,id);
		this.curUserIndex = 0;
		this.tmpCurIndex = -1;
		this.totalUser = 0;
	  this.tw;
		this.cw;
		this.isScrolling = false;
		this.mouseDown = false;
		this.scrollPrevX = 0;

		/*display elements*/
		this.userlist = null;
		this.container = null;
		this.containerWrapper = null;
		this.btnReady = null;
		this.screenRes = null;
		this.udataStatus = null;
		this.scrollStatus = null;
		this.thumbStyles = ["normal","skipped","dimmed"];


	}


	PageUserList.prototype = Object.create(Page.prototype);
  PageUserList.prototype.constructor = PageUserList;
	PageUserList.prototype.init = function(){

		this.userlist 				= $$("userlist");
		this.container 				= $$("thumbContainer");
		this.containerWrapper = $$("thumbContainerWrapper");
		this.btnReady				  = $$("btn-ready");
		this.screenRes        = $$("screenRes");
		this.udataStatus      = $$("udataStatus");
		this.scrollStatus     = $$("scrollStatus");

		document.addEventListener("onSocketMessage",this.onSocketMessage.bind(this),false);
		document.addEventListener('mouseup',this.scrollEnd.bind(this),false);
		document.addEventListener('touchend',this.scrollEnd.bind(this),false);
		this.userlist.addEventListener('mousedown', this.scrollStart.bind(this),false);
		this.userlist.addEventListener('touchstart', this.scrollStart.bind(this),false);
		this.userlist.addEventListener('mousemove',this.scrolling.bind(this),false);
		this.userlist.addEventListener('touchmove',this.scrolling.bind(this),false);

		this.btnReady	.disabled = true;


		//this.getUserDataFromLocalStorage();
		//document.documentElement.style.position = "fixed";
		//document.documentElement.style.overFlow = "hidden";
		//document.body.style.position = "fixed";
		//document.body.style.overFlow = "hidden";

		this.screenRes.innerHTML = window.innerWidth+":"+window.innerHeight;
	}

	PageUserList.prototype.cancel = function(){
		app.paging(0);
	}

  /*Socket Message*/
	PageUserList.prototype.onSocketMessage = function(e){
		if(e.detail.cmd == "USERDATA"){
			this.addUserData(e.detail.msg);
			tcssocket.send("ALL","USERDATA_RECEIVED",this.getNumberInQueue());
		}
	}


	/*Get UserQueue*/
	PageUserList.prototype.getUserDataFromLocalStorage = function(){
		if (typeof(Storage) !== "undefined") {
			this.initUserQueueWithData(localStorage.getItem("userqueues"));
		}
	}
	PageUserList.prototype.getUserDataFromServer = function(){
 	 if(confirm("Are you sure you want to bring user queues from server?")){
 		 this.deleteQueue(false);
 		 var cmsURL = "http://"+conf.CMS_IP+conf.CMS_REQUEST_QUEUE;
 			 postAjax(cmsURL, {}, function(readyState,status,data){
 				 log("readyState : "+readyState);
 				 log("status : "+status);
 				 if(readyState == 4){
 						 if(status == 200){
							 this.initUserQueueWithData(data);
							 this.saveQueueAtLocalStorage();
 						 }else if(status == 404){
							 alert("404 Page Not Found");
 						 }else if(status == 500){
							 alert("500 Internal Server Error");
 						 }else{
							 alert("Unknown Error");
 						 }
 				 }
 			 }.bind(this));
 	 }
  }

	/*Initialise UserQueue*/
	PageUserList.prototype.initUserQueueWithData = function(data){
		//console.log("userData : "+data);
		if(data != null){
			app.udata = JSON.parse(data);
			for(var i = 0;i<app.udata.userqueues.length;i++){
				if(app.udata.userqueues[i] == null){
					app.udata.userqueues.splice(i,1);
				}else{
					this.addThumbnail(app.udata.userqueues[i]);
				}
			}
			this.totalUser = app.udata.userqueues.length;
			this.setCurUserIndex();
			this.thumbnailOrdering();
			this.displayStatus();
		}
		this.getNumberInQueue();
	}

	PageUserList.prototype.saveQueueAtServer = function(){
		var cmsURL = "http://"+conf.CMS_IP+conf.CMS_SAVE_QUEUE;
		var obj = {};
		obj.userQueues = JSON.stringify(app.udata);
			postAjax(cmsURL, obj, function(readyState,status,data){
				log("readyState : "+readyState);
				log("status : "+status);
				log("data : "+data);
				if(readyState == 4){
						if(status == 200){

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

	PageUserList.prototype.saveQueueAtLocalStorage = function(){
		var jstr = JSON.stringify(app.udata);
		localStorage.setItem("userqueues", jstr );
	}

	PageUserList.prototype.deleteQueue = function(chk){
		var bool = true;
		if(chk){
			bool = confirm("Are you sure you want to delete user queues?");
		}

		if(bool){
			for(var i = 0;i<app.udata.userqueues.length;i++){
				this.deleteThumbnail(app.udata.userqueues[i]);
	  	}
			app.udata.userqueues = [];
			this.totalUser = 0;
			this.setCurUserIndex();
			this.saveQueueAtLocalStorage();
			this.displayStatus();
		}
	}


	PageUserList.prototype.clearBoard = function(){
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




	/*Manipulates UserData*/

	PageUserList.prototype.addUserData = function(info){
			var uinfos = info.split(",");
			var uobj = {"status":0,"userFirstName":uinfos[0],"userLastName":uinfos[1],"userEmail":uinfos[2],"userFlag":uinfos[3],"userMobile":uinfos[4],"userPostcode":uinfos[5],"userOption1":uinfos[6],"userOption2":uinfos[7],"userOption3":uinfos[8],"userTitle":uinfos[9],"thumb":null};
			app.udata.userqueues.push(uobj);
			this.saveQueueAtServer();
			this.saveQueueAtLocalStorage();
			this.totalUser = app.udata.userqueues.length;
			this.addThumbnail(uobj);
			if(this.currentpage == 1){
				this.setCurUserIndex();
				this.thumbnailOrdering();
			}
			this.displayStatus();
	}

	PageUserList.prototype.deleteThumbnail = function(obj){
		if(obj && obj.thumb){
			this.containerWrapper.removeChild(obj.thumb);
		}
		var cn = this.containerWrapper.children;
		this.containerWrapper.style.width = cn.length*244+"px";
	}

	PageUserList.prototype.addThumbnail = function(obj){
		log("addThumbnail : "+app.udata.userqueues.length);
			var thumb = document.createElement("DIV");

			//thumb.add
			if(obj != null){
				//userFirstName,userLastName,userEmail,userFlag,userMobile,userPostcode,userOption1,userOption2
				var fnames = obj.userFirstName.split("|");
				var lnames = obj.userLastName.split("|");
				var flags  = obj.userFlag.split("|");
				var levels = obj.userOption1.split("|");

				if(app.multiUser==2){
					var nStr1 = "<input type='text' class='uname noselect' readonly='true' value="+fnames[0]+"><input type='text' class='uname noselect' readonly='true' value="+lnames[0]+">";
					var fStr1 = "<img src = './img/flags/flag"+(parseInt(flags[0]))+".png'/>";
					if(fnames[0] == undefined || fnames[0] == "" || parseInt(flags[0])<0){
						nStr1 = "<input type='text' class='uname noselect ' readonly='true' value='CPU'>";

					}
					var nStr2 = "<input type='text' class='uname noselect' readonly='true' value="+fnames[1]+"><input type='text' class='uname noselect' readonly='true' value="+lnames[1]+">";
					var fStr2 = "<img src = './img/flags/flag"+(parseInt(flags[1]))+".png'/>";
					if(fnames[1] == undefined || fnames[1] == "" || parseInt(flags[1])<1){
						nStr2 = "<input type='text' class='uname noselect' readonly='true' value='CPU'>";

					}

					if(app.useFlag == false){
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
					var nStr1 = "<input type='text' class='uname noselect' readonly='true' value="+fnames[0]+"><input type='text' class='uname noselect' readonly='true' value="+lnames[0]+(levels[0]=="true"?"*":"")+">";
					var fStr1 = "<img src = './img/flags/flag"+(parseInt(flags[0]))+".png'/>";
					if(fnames[0] == undefined || fnames[0] == "" || parseInt(flags[0])<1){
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
				 this.thumbnailStyle(thumb,this.thumbStyles[obj.status]);

			}else{
				 this.thumbnailStyle(thumb,"normal");
			}

			this.containerWrapper.appendChild(thumb);
			var cn = this.containerWrapper.children;
			this.containerWrapper.style.width = cn.length*244+"px";

			this.thumbnailOrdering();
			this.displayStatus();
			log("thumbContainerWrapper : "+this.containerWrapper.style.left+" :: "+cn.length);

	}

	PageUserList.prototype.thumbnailStyle = function(thumb,style){
			     if(style == "normal") {thumb.className = "thumb-item";}
			else if(style == "active") {thumb.className = "thumb-item thumb-item-active";}
			else if(style == "dimmed") {thumb.className = "thumb-item thumb-item-dimmed";}
			else if(style == "skipped"){thumb.className = "thumb-item thumb-item-skipped";}
		}
	PageUserList.prototype.thumbnailOrdering = function(){
		if(this.curUserIndex>-1 && this.curUserIndex<app.udata.userqueues.length){
			var centerThumb = app.udata.userqueues[this.curUserIndex].thumb;
			var thumbX     = centerThumb.offsetLeft;
			var thumbWidth = centerThumb.offsetWidth;
			var containerWidth = this.container.offsetWidth;
			var wrapperWidth = this.containerWrapper.offsetWidth;

			for(var i = 0;i<app.udata.userqueues.length;i++){
				var thumb = app.udata.userqueues[i].thumb;
				if(thumb){
					if(thumb == centerThumb){
						this.thumbnailStyle(thumb,"active");
					}else{
						 //console.log("app.udata.userqueues[i].status : "+app.udata.userqueues[i].status+"::"+thumbStyles[app.udata.userqueues[i].status]);
						 this.thumbnailStyle(thumb,this.thumbStyles[app.udata.userqueues[i].status]);
					}
				}

			}
			TweenMax.to(this.containerWrapper,0.5,{left:-(thumbX-20)+"px",ease:Power2.easeOut});
		}
	}



	PageUserList.prototype.scrollToUser = function(n){

			this.curUserIndex = this.curUserIndex+n;
			if(this.curUserIndex<0)this.curUserIndex = 0;
			if(this.curUserIndex>=app.udata.userqueues.length)this.curUserIndex=app.udata.userqueues.length-1;
			if(n==0){
				this.setCurUserIndex();
			}
			this.thumbnailOrdering();
			this.displayStatus();

	}
	PageUserList.prototype.displayStatus = function(){
		this.totalUser = app.udata.userqueues.length;
		if(this.totalUser>0)this.btnReady.disabled = false;
		this.udataStatus.innerHTML = "current user : "+(this.curUserIndex+1)+"/"+this.totalUser;
		this.scrollStatus.innerHTML = "scrolling : "+this.isScrolling+" x:"+this.scrollPrevX;
	}

	PageUserList.prototype.updateUserStatus = function(){
		if(this.tmpCurIndex>-1){
			var cntPassed = 0;
			var needToDelete = -1;
			var uobj;
			var maxQueue = 10;
			var cntQueue = 0;

			var qlist = {"userqueues":[]}

			for(var i=0;i<app.udata.userqueues.length;i++){
				uobj = app.udata.userqueues[i];
				if(i < this.tmpCurIndex && uobj.status == 0){
					uobj.status = 1;
					this.thumbnailStyle(uobj.thumb,"skipped");
				}
				if(i == this.tmpCurIndex){
					uobj.status = 2;
					this.thumbnailStyle(uobj.thumb,"dimmed");
					qlist.userqueues.push({"uname":(uobj.userFirstName+" "+uobj.userLastName),"flag":uobj.userFlag});
				}
				if(uobj.status == 2){
					if(needToDelete<0)needToDelete = i;
					cntPassed++;
				}

				if(i > this.tmpCurIndex && uobj.status=="0" && cntQueue<maxQueue){
					qlist.userqueues.push({"uname":(uobj.userFirstName+" "+uobj.userLastName),"flag":uobj.userFlag});
					cntQueue++;
				}

			}

			if(cntQueue>0){
				var jstr = JSON.stringify(qlist);
				tcssocket.send("ALL","QUEUE_LIST",jstr);
			}

			this.tmpCurIndex = -1;
			if(cntPassed>20 && needToDelete>-1){
				this.deleteThumbnail(app.udata.userqueues[needToDelete]);
				app.udata.userqueues.splice(needToDelete,1);
			}
			this.totalUser = app.udata.userqueues.length;
			this.saveQueueAtLocalStorage();
			this.setCurUserIndex();
			this.thumbnailOrdering();
			this.displayStatus();
		}
	}



/* SCROLL */

	PageUserList.prototype.pointerEventToXY = function(e){
		 var out = {x:0, y:0};
		 if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
			 var touch = e.touches[0] || e.changedTouches[0];
			 out.x = touch.pageX;
			 out.y = touch.pageY;
		 } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
			 out.x = e.pageX;
			 out.y = e.pageY;
		 }
		 return out;
	 };
	PageUserList.prototype.scrollStart = function(e){
		var p = this.pointerEventToXY(e);
		this.scrollPrevX = p.x;
		this.mouseDown = true;
		this.displayStatus();
	}
	PageUserList.prototype.scrollEnd = function(e){
		if(this.mouseDown && this.isScrolling){
			this.calIndexInMiddle();
		}
		this.isScrolling = false;
		this.mouseDown = false;
		this.displayStatus();
	}
	PageUserList.prototype.scrolling = function(e){
		if( this.mouseDown){
			this.isScrolling = true;
			this.displayStatus();
			var p = this.pointerEventToXY(e);
			this.scrollSpeed = p.x-this.scrollPrevX;
			this.scroll(this.scrollSpeed);
			this.scrollPrevX = p.x;
		}
	}

	PageUserList.prototype.scroll = function(n){
		var l = parseInt(this.containerWrapper.style.left) ;
		this.containerWrapper.style.left = l+n+"px";
	}
	PageUserList.prototype.currentUserSetting = function(){

	}
	PageUserList.prototype.calIndexInMiddle = function(){
		var l = parseInt(this.containerWrapper.style.left) ;
		this.curUserIndex = Math.floor(((l+this.scrollSpeed*5)*-1+122)/244);
		//console.log("this.curUserIndex : "+this.curUserIndex);
		if(isNaN(this.curUserIndex))this.curUserIndex = 0;
		if(this.curUserIndex>=app.udata.userqueues.length){
			this.curUserIndex=app.udata.userqueues.length-1;
		}
		if(this.curUserIndex<0)this.curUserIndex = 0;
		//	console.log("this.curUserIndex 2 : "+this.curUserIndex);
		this.thumbnailOrdering();
		this.displayStatus();
	}

	PageUserList.prototype.setCurUserIndex = function(){
			this.curUserIndex = this.totalUser-1;
			for(var i=0;i<app.udata.userqueues.length;i++){
				if(app.udata.userqueues[i] && app.udata.userqueues[i].status == 0){
					this.curUserIndex = i;
					break;
				}
			}
			if(this.curUserIndex<0)this.curUserIndex = 0;
		}

	PageUserList.prototype.getNumberInQueue = function(){
		var q = 0;
			for(var i = 0;i<app.udata.userqueues.length;i++){
				if(parseInt(app.udata.userqueues[i].status) == 0){
					q++;
				}
			}
			console.log("getNumberInQueue : "+q);
			return q;
	}


  //getAjax('http://foo.bar/?p1=1&p2=Hello+World', function(data){ console.log(data); });
	// example request
	//postAjax('http://foo.bar/', 'p1=1&p2=Hello+World', function(data){ console.log(data); });

	// example request with data object
	//postAjax('http://foo.bar/', { p1: 1, p2: 'Hello World' }, function(data){ console.log(data); });
