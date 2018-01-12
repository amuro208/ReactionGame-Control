	var app = function(){

	}

	app.udata =
	{
	  "userqueues":[]
	}
	app.pages = [];
	app.page_headers = ["",""];
	
	app.userData = {}
  app.ispopup = false;
	app.useFlag = true;
	app.multiUser = 1;
	app.previouspage = 0;
  app.currentpage = 0;

  app.isGameRunning = false;
	app.isGameReady = false;

  app.tcssocket = null;

	app.init = function(){
/*
		document.body.addEventListener('touchmove',function(e)
		{
			e = e || window.event;
			var target = e.target || e.srcElement;
			//in case $altNav is a class:
			if (!target.className.match(/\bscrollable\b/))
			{
					e.returnValue = false;
					e.cancelBubble = true;
					if (e.preventDefault)
					{
							e.preventDefault();
							e.stopPropagation();
					}
					return false;//or return e, doesn't matter
			}
			//target is a reference to an $altNav element here, e is the event object, go mad
		},false);
*/
			conf.init();

			console.log("TCSWebSocket.CMD_SOCKET_IP : "+TCSWebSocket.CMD_SOCKET_IP);

			this.tcssocket = new TCSWebSocket();

			log("conf.initialReady : "+conf.initialReady);

			if(conf.initialReady){
				this.connectSocket();

			}else{
				openFullPopup('configuration');
				//tcssocket.status("Configurations are default. Please set your preferences");
			}
			this.paging(1);
	}


	app.connectSocket = function(){
		document.addEventListener("onSocketMessage",onSocketMessage);
		document.addEventListener("onSocketClose",onSocketClose);
		document.addEventListener("onSocketError",onSocketError);
		document.addEventListener("onSocketOpen",onSocketOpen);
		this.tcssocket.setip(conf.CMD_SOCKET_ID,conf.CMD_SOCKET_IP,conf.CMD_SOCKET_PORT);
		this.tcssocket.connect();
	}


	app.paging = function(n){
	//log(":::::::::::::::::::::"+$$(pages[0]));
		for(i in this.pages){
			var page = this.pages[i];
			if(i == n){
				page.show();
			}else{
				page.hide();
			}
		}
		if(this.page_headers[n]!=""){
			document.getElementsByClassName("masthead")[0].getElementsByTagName("H1")[0].innerHTML = this.page_headers[n];
		}
		this.previouspage = this.currentpage;
		this.currentpage = n;
	}

	var onSocketMessage = function(e){
		log("onSocketMessage : "+e.detail.to +"#"+e.detail.cmd+"#"+e.detail.from+"#"+e.detail.msg);
	}

	var onSocketClose = function(e){
		openFullPopup('configuration');
	}

	var onSocketError = function(e){
		openFullPopup('configuration');
	}

	var onSocketOpen = function(e){
		closeFullPopup('configuration');
	}

	var openFullPopup = function(id){
		$$(id).style.display = "block";
		ispopup = true;
	}
	var closeFullPopup = function(id){
		$$(id).style.display = "none";
		ispopup = false;
	}

	var parseXml;

	if (typeof window.DOMParser != "undefined") {
	    parseXml = function(xmlStr) {
	        return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
	    };
	} else if (typeof window.ActiveXObject != "undefined" &&
	       new window.ActiveXObject("Microsoft.XMLDOM")) {
	    parseXml = function(xmlStr) {
	        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
	        xmlDoc.async = "false";
	        xmlDoc.loadXML(xmlStr);
	        return xmlDoc;
	    };
	} else {
	    throw new Error("No XML parser found");
	}
	console.log("parseXml : "+parseXml);
