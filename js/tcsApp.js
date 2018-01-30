
var confDefault = {

}

var tcsapp = {}

tcsapp.pages = [];
tcsapp.previouspage = 0;
tcsapp.currentpage = 0;

tcsapp.isGameRunning = false;
tcsapp.isGameReady = false;

tcsapp.tcssocket = null;
tcsapp.panelDebug = null;
tcsapp.panelConf = null;



tcsapp.init = function(){

		conf = {
			CMD_SOCKET_ID:1,
			CMD_SOCKET_IP:"127.0.0.1",
			CMD_SOCKET_PORT:9000,
			CMS_EVENT_CODE:"QS",
			CMS_IP:"127.0.0.1",
			CMS_UPLOAD:"/app/codeigniter/index.php/upload/",
			CMS_LIST:"/app/codeigniter/index.php/upload/qsrank/",
			CMS_CLEAR_BOARD:"/app/codeigniter/index.php/upload/qsrankclear/",
			CMS_REQUEST_QUEUE:"/app/requestQueue.php",
			CMS_SAVE_QUEUE:"/app/saveQueue.php",
			APP_INFINITE_TEST:"N",
			USE_FLAG:"Y",
			USE_CPU_OPPONENT:"Y",
			MULTI_USER:2
		};

		document.addEventListener("onConfigLoaded",()=>{
			this.panelDebug = new PanelDebug('panelDebug');
			this.panelDebug.init();
			this.panelConf = new PanelConf('panelConf');
			this.panelConf.setKeys(conf);
			this.panelConf.init();

			this.tcssocket = new TCSWebSocket();

			if(confCtrl.initialReady){
				this.connectSocket();

			}else{
				this.panelConf.show();

			}
			this.paging(1);
		})

		confCtrl.load();
}


tcsapp.connectSocket = function(){
	this.tcssocket.setip(conf.CMD_SOCKET_ID,conf.CMD_SOCKET_IP,conf.CMD_SOCKET_PORT);
	this.tcssocket.connect();
}


	tcsapp.paging = function(n){
	//log(":::::::::::::::::::::"+$$(pages[0]));
		for(i in this.pages){
			var page = this.pages[i];
			if(i == n){
				page.ready();
				page.show();
				page.start();
			}else{
				page.stop();
				page.hide();
				page.clear();
			}
		}

		this.previouspage = this.currentpage;
		this.currentpage = n;
	}


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
