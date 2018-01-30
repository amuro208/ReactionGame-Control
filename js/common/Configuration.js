

//var fs = require("fs");
var conf = {};
var preset = {};
preset.current = {};
preset.default = {};

var confCtrl = {};
confCtrl.initialReady = false;
confCtrl.load = function(){
    if (typeof(Storage) !== "undefined") {
      var flag = false;
      if(localStorage.getItem("current") != null){flag = true;preset.current = localStorage.getItem("current");}
      if(localStorage.getItem("default") != null){flag = true;preset.default = localStorage.getItem("default");}

      if(!flag){
        confCtrl.objCopy(conf,preset.current);
        confCtrl.objCopy(conf,preset.default);
        localStorage.setItem("current",preset.current);
        localStorage.setItem("default",preset.default);
      }else{
        confCtrl.initialReady = true;
      }

      console.log("preset.current : "+JSON.stringify(preset.current,null," "));
      console.log("preset.default : "+JSON.stringify(preset.default,null," "));
    }
    var event = new CustomEvent("onConfigLoaded", {
      detail: {
        msg:"onConfigLoaded",
        time:new Date()
      },
      bubbles: true,
      cancelable: true
      });
    document.dispatchEvent(event);

  };


confCtrl.save = function(){
    localStorage.setItem("current",preset.current);
    localStorage.setItem("default",preset.default);
    this.objCopy(preset.current,conf);
    location.reload();
}

confCtrl.objCopy = function(o1,o2){
  for(var key in o1){
    o2[key] = o1[key];
  }
}
