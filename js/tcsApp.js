	var tcsApp = {}
	var pages = [];
	var page_headers = ["",""];
	var thumbStyles = ["normal","skipped","dimmed"];
	var userData = {}
  var ispopup = false;
	var useFlag = true;
	var multiUser = 1;
	var previouspage = 0;
  var currentpage = 0;

  var isGameRunning = false;
	var isGameReady = false;

	var udata =
	{
		"userqueues":[]
	}

	var User = function() {
		this.userFirstName = "";
		this.userLastName = "";
		this.userEmail = "";
		this.userFlag = -1;
		this.userMobile = "";
		this.userPostcode = "";
		this.userOption1 = false;
		this.userOption2 = false;
	  this.userOption2 = false;
		this.check = false;
		return{
			reset:function(){
				this.userFirstName = "";
				this.userLastName = "";
				this.userEmail = "";
				this.userFlag = -1;
				this.userMobile = "";
				this.userPostcode = "";
				this.userOption1 = false;
				this.userOption2 = false;
			  this.userOption2 = false;
				this.check = false;
				return null;
			},
			print:function(){
				log("User Info : "+this.userFirstName+":"+this.userLastName+":"+this.userEmail+":"+this.userFlag+":"+this.userMobile+":"+this.userPostcode+":"+this.userOption1+":"+this.userOption2+":"+this.userOption3+":"+this.check);
				return null;
			}
		}
	}



	function $$(id){ return document.getElementById(id); }

	function log(msg){
	  console.log(msg);
	  $$("log").innerHTML+="\n"+msg;
		$$("log").scrollTop  = $$("log").scrollHeight;
	}

	function toggleOnOff(id){
		if($$(id).style.display == "block"){
			$$(id).style.display = "none";
		}else{
			$$(id).style.display = "block";
		}
	}


	var init = function(){

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

		conf.init();

		if(conf.initialReady){
			  log("conf.initialReady : "+conf.initialReady);
				tcssocket.init();
				tcssocket.getSocket();
				document.addEventListener("onSocketMessage",onSocketMessage);
				document.addEventListener("onSocketClose",onSocketClose);
				document.addEventListener("onSocketError",onSocketError);
				document.addEventListener("onSocketOpen",onSocketOpen);
			}else{
				openFullPopup('configuration');
				tcssocket.status("Configurations are default. Please set your preferences");
			}
			paging(0);
	}

	var paging = function(n){
	//log(":::::::::::::::::::::"+$$(pages[0]));
		for(i in pages){
			if(i == n){
				$$(pages[i]).style.display = "block";
			}else{
				$$(pages[i]).style.display = "none";
			}
		}
		if(page_headers[n]!=""){
			document.getElementsByClassName("masthead")[0].getElementsByTagName("H1")[0].innerHTML = page_headers[n];
		}
		previouspage = currentpage;
		currentpage = n;
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
	var pointerEventToXY = function(e){
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

		 function getAjax(url, result) {
	 	    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
	 	    xhr.open('GET', url);
	 	    xhr.onreadystatechange = function() {
	 	       result(xhr.readyState,xhr.status,xhr.responseText);
	 	    };
	 	    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	 	    xhr.send();
	 	    return xhr;
	 	}
	 	function postAjax(url, data, result) {
	 	    var params = typeof data == 'string' ? data : Object.keys(data).map(
	 	            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
	 	        ).join('&');

	 	    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	 	    xhr.open('POST', url);
	 	    xhr.onreadystatechange = function() {
	 	       result(xhr.readyState,xhr.status,xhr.responseText);
	 	    };
	 	    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	 	    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	 	    xhr.send(params);
	 	    return xhr;
	 	}





		/* String Utils*/



	 function  specialCharChk(str) {

			var regExpPattern = /[*|\":<>[\]{}`\\()';,#@&$]/;
      //var regExpPattern = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g
			return regExpPattern.test(str);
		}
	 function  emailMalformedChk(emailStr) {

			var regExpPattern = /^[0-9a-zA-Z][-._a-zA-Z0-9]*@([0-9a-zA-Z][-._0-9a-zA-Z]*\.)+[a-zA-Z]{2,4}$/;

			return regExpPattern.test(emailStr);
		}

	 function  mobileMalformedChk(str) {
			var result = true;

			if(str.length!=10) result = false;

			for(var i = 0; i<str.length; i++){
				var chkCode = str.charCodeAt(i);
				if(chkCode<48 || chkCode>57){
					if(chkCode != 45){
						result = false;
						break;
					}
				}
			}
			return result;
		}

	 function  postCodeformedChk(str) {

			if(str.length!=4) return false;

			for(var i = 0; i<str.length ; i++){
				if(str.charCodeAt(i)<48 || str.charCodeAt(i) >57){
					return false;
				}
			}

			return true;
		}

	 function hiddenText(str) {
			var arr = new Array();
			for(var i = 0;i<str.length;i++){
				if(str.charAt(i) == "-"){
					arr.push("-");
				}else{
					arr.push("*");
				}
			}
			return toStr(arr);
		}

		var _mobileCheckRule;
	 function  mobileNumberWithRule(str,isBackKey) {
			var arr = new Array();
			var j;
			var i;
			var index;
			var tmpStr = "";
			for(i=0;i<str.length;i++){
				for(j = 0;j<_mobileCheckRule.length;j++){
					index = _mobileCheckRule[j];
					if(i == index){
						if(!isBackKey || isBackKey && str.length>index)
							arr.push("-");
						continue;
					}
				}
				arr.push(str.charAt(i));
			}
			return tmpStr = toStr(arr);
		}

	 function mobileCheckRule(str){
			var arr = new Array();
			var n = 0;
			for(var i=0;i<str.length;i++){
				if(str.charAt(i) == "-"){
					arr.push(i-n);
					n++;
				}
			}
			_mobileCheckRule =  arr;
		}
	 function toStr(arr)
		{
			var str = "";
			for(var k=0;k<arr.length;k++)
			{
				str+=arr[k];
			}
			return str;
		}
