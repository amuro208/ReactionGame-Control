var tcssocket = {};

	tcssocket.socket;
	tcssocket.CMD_SOCKET_ID = 1;
	tcssocket.CMD_SOCKET_IP = "192.168.0.2";
	tcssocket.CMD_SOCKET_PORT = 9000;

	tcssocket.reconnectId;
	tcssocket.connected = false;
	tcssocket.isReconnectRequre = true;
	tcssocket.reconnectCnt = 0;

	tcssocket.init = function(){
		if(conf){
			this.CMD_SOCKET_ID = conf.CMD_SOCKET_ID;
			this.CMD_SOCKET_IP = conf.CMD_SOCKET_IP;
			this.CMD_SOCKET_PORT = conf.CMD_SOCKET_PORT;
		}
	}

	tcssocket.getSocket = function () {

		if (this.socket != null) {
			this.socket.onopen = null;
			this.socket.onmessage = null;
			this.socket.onclose = null;
			this.socket.onerror = null;
			this.socket = null;
		}
		if(this.connected){
			return;
		}

		var host = "ws://"+this.CMD_SOCKET_IP+":"+this.CMD_SOCKET_PORT; // SET THIS TO YOUR SERVER
    tcssocket.status("Connecting to socket : "+tcssocket.CMD_SOCKET_IP+":"+tcssocket.CMD_SOCKET_PORT+" "+tcssocket.CMD_SOCKET_ID);
		try {
			this.socket = new WebSocket(host);

			this.socket.onopen    = function(msg) {
							   tcssocket.onOpen();
						   };
			this.socket.onmessage = function(msg) {
							   tcssocket.onMessage(msg.data);
						   };
			this.socket.onclose   = function(msg) {
							  tcssocket.onClose();
						   };
			this.socket.onerror   = function(msg) {
							  tcssocket.onError();
						   };
		}
		catch(ex){
			log(ex);
		}

	}
	tcssocket.onMessage = function (msg){
		var packets = msg.split("#");
		log(msg);
		if(packets.length == 5 && packets[packets.length-1] == "EOF"){
			var to   = packets[0];
			var cmd  = packets[1];
			var from = packets[2];
			var message  = packets[3];
			//console.log("CMD : "+cmd);
			if(cmd == "DECLINED"){
					tcssocket.status("Connection declined. ID already exists");
					tcssocket.quit();
			}else{
				var event = new CustomEvent("onSocketMessage", {
				detail: {
					to:to,
					cmd:cmd,
					from:from,
					msg:message,
					time:new Date()
				},
				bubbles: true,
				cancelable: true
				});

				document.dispatchEvent(event);
			}

		}
	}
	tcssocket.status = function(s){
		  log(s);
			$$("configurationStatus").innerHTML = s;
	}
	tcssocket.onOpen = function (){
		//log("Hi!");
		//log("this.socket.status : "+tcssocket.socket.readyState);
		tcssocket.status("Connected to socket : "+tcssocket.CMD_SOCKET_IP+":"+tcssocket.CMD_SOCKET_PORT+" "+tcssocket.CMD_SOCKET_ID);
		tcssocket.connected = true;
		tcssocket.reconnectCnt = 0;
		tcssocket.socket.send("CLIENT"+tcssocket.CMD_SOCKET_ID);
		var event = new CustomEvent("onSocketOpen", {
			detail: {
				msg:"onSocketOpen",
				time:new Date()
			},
			bubbles: true,
			cancelable: true
			});

		setTimeout(function(){
			if(tcssocket.connected){
				$$("btn-connect").disabled = true;
				document.dispatchEvent(event);
			}
		},2000);
	}
	tcssocket.onClose = function (){

		$$("btn-connect").disabled = false;
		//console.log("this.socket.status : "+tcssocket.socket.readyState );
		tcssocket.connected = false;
		if(tcssocket.isReconnectRequre){
			tcssocket.status("Closed! Trying to reconnect "+tcssocket.reconnectCnt);
			tcssocket.reconnectId = setTimeout(function(){
				tcssocket.getSocket();
			}, 5000);
			tcssocket.reconnectCnt++;
		}else{
			tcssocket.status("Closed!");
		}
		var event = new CustomEvent("onSocketClose", {
			detail: {
				msg:"onSocketClose",
				time:new Date()
			},
			bubbles: true,
			cancelable: true
			});

			document.dispatchEvent(event);
	}
	tcssocket.onError = function (){
		tcssocket.status("Error");
		$$("btn-connect").disabled = false;
		/*
		log("Error!");
		this.connected = false;
		if(this.reconnectId){
			clearTimeout(this.reconnectId);
		}
		if(this.isReconnectRequre){
			this.reconnectId = setTimeout(tcssocket.getSocket(), 500000);
		}
		var event = new CustomEvent("onSocketError", {
			detail: {
				msg:"onSocketError",
				time:new Date()
			},
			bubbles: true,
			cancelable: true
			});

			document.dispatchEvent(event);
			*/
	}

	tcssocket.send = function (to,cmd,msg){
		try {
			var packet = ""+to+"#"+cmd+"#"+this.CMD_SOCKET_ID+"#"+msg+"#EOF";

			if(this.socket.readyState == 1)this.socket.send(packet);
			log('Sent: '+this.socket.readyState+" :: "+packet);
		} catch(ex) {
			log(ex);
		}
	}
	tcssocket.sendMessage = function (){
		var txt,msg;
		txt = $$("msg");
		if(txt){
			msg = txt.value;
			if(!msg) {
				alert("Message can not be empty");
				return;
			}
			this.send("ALL","MSG",msg);
			txt.value="";

		}
	}
	tcssocket.quit = function (){
		this.isReconnectRequre = false;
		this.close();
	}
	tcssocket.close = function (){
		if (this.socket != null) {
			log("Goodbye!");
			this.socket.close();
			this.socket=null;
		}
	}

	tcssocket.connect = function () {
		if(this.connected == false){
			conf.save();
			this.getSocket();
			this.isReconnectRequre = true;
		}
	}

	tcssocket.reset = function () {

	}

	// Utilities
