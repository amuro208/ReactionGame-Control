const confDefault = {};
			confDefault.CMD_SOCKET_ID = 1;
			confDefault.CMD_SOCKET_IP = "127.0.0.1";
			confDefault.CMD_SOCKET_PORT = 9000;
			confDefault.CMS_EVENT_CODE = "QS";
			confDefault.CMS_IP = "192.168.0.2";
			confDefault.CMS_UPLOAD = "/codeigniter/index.php/upload/";
			confDefault.CMS_LIST   = "/codeigniter/index.php/upload/qsrank/";
			confDefault.CMS_CLEAR_BOARD = "/codeigniter/index.php/upload/qsrankclear/";
			confDefault.CMS_REQUEST_QUEUE = "/controller/requestQueue.php";
			confDefault.CMS_SAVE_QUEUE  = "/controller/saveQueue.php";

			confDefault.APP_INFINITE_TEST = "N";


const conf = Object.create(confDefault);
	conf.initialReady = false;
	conf.keys = [
		'CMD_SOCKET_IP',
		'CMD_SOCKET_PORT',
		'CMD_SOCKET_ID',
		'CMS_EVENT_CODE',
		'CMS_IP','CMS_UPLOAD',
		'CMS_LIST',
		'CMS_CLEAR_BOARD',
		'CMS_REQUEST_QUEUE',
		'CMS_SAVE_QUEUE',
		'APP_INFINITE_TEST'
	];

	conf.init = function(){
		var vlen = this.keys.length;
		var chk = true;
		if (typeof(Storage) !== "undefined") {
			for(var i = 0; i<vlen; i++){
				var key = this.keys[i];
				var value = localStorage.getItem(key);
				console.log("initial saved value ["+key+"] : "+value);
				if(value != null) this[key] = value;
				else chk = false;
			}
			this.initialReady = chk;
			if(chk){
				console.log("conf initialised");
			}else{
				console.log("conf default value");
			}
		}
		for(var i = 0; i<vlen; i++){
			var key = this.keys[i];
			var value = this[key];
			this.setConfItem(key, value);
		}

	}

	conf.save = function (){
		var vlen = this.keys.length;
		for(var i = 0; i<vlen; i++){
			var key = this.keys[i];
			var value = this.getConfItem(key);
			localStorage.setItem(key, value);
			console.log("saved value ["+key+"] : "+value);
			this[key] = value;
		}
		console.log("new values saved to local storage");
	}

	conf.default = function (){
		var vlen = this.keys.length;
		for(var i = 0; i<vlen; i++){
			var key = this.keys[i];
			var value = confDefault[key];
			localStorage.setItem(key, value);
			this.setConfItem(key, value);
			this[key] = value;
		}
		console.log("default values set to local storage");
	}

	conf.setConfItem = function(id,value){
		if($$(id))$$(id).value = value;
	}
	conf.getConfItem = function(id){
		if($$(id)!=null || $$(id)!=undefined)return $$(id).value;
		else return "";
	}

	this.status = function(s){
			log(s);
			$$("configurationStatus").innerHTML = s;
	}

	// Utilities
