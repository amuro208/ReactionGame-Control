var conf = {};


	conf.CMD_SOCKET_ID = 1;
	conf.CMD_SOCKET_IP = "192.168.0.2";
	conf.CMD_SOCKET_PORT = 9000;
	conf.CMS_EVENT_CODE = "WS";
	conf.CMS_IP = "192.168.0.2";
	conf.CMS_UPLOAD = "/ws/upload.php";
	conf.CMS_LIST = "/ws/list.php";
	conf.initialReady = false;

	conf.init = function(){
		if (typeof(Storage) !== "undefined") {
			if(localStorage.getItem("cmd_ip") != null)      this.CMD_SOCKET_IP   = localStorage.getItem("cmd_ip");
			if(localStorage.getItem("cmd_port") != null)    this.CMD_SOCKET_PORT = localStorage.getItem("cmd_port");
			if(localStorage.getItem("cmd_id") != null)      this.CMD_SOCKET_ID   = localStorage.getItem("cmd_id");
			if(localStorage.getItem("cms_evt_code") != null)this.CMS_EVENT_CODE  = localStorage.getItem("cms_evt_code");
			if(localStorage.getItem("cms_ip") != null)      this.CMS_IP          = localStorage.getItem("cms_ip");
			if(localStorage.getItem("cms_upload") != null)  this.CMS_UPLOAD      = localStorage.getItem("cms_upload");
			if(localStorage.getItem("cms_list") != null)    this.CMS_LIST        = localStorage.getItem("cms_list");
			this.initialReady = true;
		}
		this.setConfItem("cmd_ip",      this.CMD_SOCKET_IP);
		this.setConfItem("cmd_port",    this.CMD_SOCKET_PORT);
		this.setConfItem("cmd_id",      this.CMD_SOCKET_ID);
		this.setConfItem("cms_evt_code",this.CMS_EVENT_CODE);
		this.setConfItem("cms_ip",      this.CMS_IP);
		this.setConfItem("cms_upload",  this.CMS_UPLOAD);
		this.setConfItem("cms_list",    this.CMS_LIST);
		log(this.CMD_SOCKET_IP+":"+this.CMD_SOCKET_PORT+"    ID:"+this.CMD_SOCKET_ID)
	}

	conf.save = function (){
		localStorage.setItem("cms_evt_code", this.getConfItem("cms_evt_code"));
		localStorage.setItem("cms_ip",       this.getConfItem("cms_ip"));
		localStorage.setItem("cms_upload",   this.getConfItem("cms_upload"));
		localStorage.setItem("cms_list",     this.getConfItem("cms_list"));
		localStorage.setItem("cmd_ip",       this.getConfItem("cmd_ip"));
		localStorage.setItem("cmd_port",     this.getConfItem("cmd_port"));
		localStorage.setItem("cmd_id",       this.getConfItem("cmd_id"));
		this.CMD_SOCKET_IP   = localStorage.getItem("cmd_ip");
		this.CMD_SOCKET_PORT = localStorage.getItem("cmd_port");
		this.CMD_SOCKET_ID   = localStorage.getItem("cmd_id");
		this.CMS_EVENT_CODE  = localStorage.getItem("cms_evt_code");
		this.CMS_IP          = localStorage.getItem("cms_ip");
		this.CMS_UPLOAD      = localStorage.getItem("cms_upload");
		this.CMS_LIST        = localStorage.getItem("cms_list");
	}
	conf.default = function (){

	}
	conf.setConfItem = function(id,value){
		if($$(id))$$(id).value = value;
	}
	conf.getConfItem = function(id){
		if($$(id)!=null || $$(id)!=undefined)return $$(id).value;
		else return "";
	}


	// Utilities
