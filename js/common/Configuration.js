

//var fs = require("fs");

var conf = {};
var preset = {};
preset.current = {};
preset.default = {};

var confCtrl = {};
confCtrl.initialReady = false;
confCtrl.id = "";
confCtrl.load = function(){
    if (typeof(Storage) !== "undefined") {
      if(localStorage.getItem(this.id+".current") != null && localStorage.getItem(this.id+".default") != null){
        console.log("YES THERE ARE CONFIGUTATIONS");
        preset.current = JSON.parse(localStorage.getItem(this.id+".current"));
        preset.default = JSON.parse(localStorage.getItem(this.id+".default"));
        confCtrl.initialReady = true;
      }else{
        console.log("NO NOTHING!");
        confCtrl.objCopy(conf,preset.current);
        confCtrl.objCopy(conf,preset.default);
        localStorage.setItem(this.id+".current",JSON.stringify(preset.current,null," "));
        localStorage.setItem(this.id+".default",JSON.stringify(preset.default,null," "));
      }

      console.log("preset.current : "+JSON.stringify(preset.current,null," "));
      console.log("preset.default : "+JSON.stringify(preset.default,null," "));
    }else{
      console.log('typeof(Storage) == "undefined"');
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
    localStorage.setItem(this.id+".current",JSON.stringify(preset.current,null," "));
    localStorage.setItem(this.id+".default",JSON.stringify(preset.default,null," "));
    this.objCopy(preset.current,conf);
    location.reload();
}

confCtrl.objCopy = function(o1,o2){
  for(var key in o1){
    o2[key] = o1[key];
  }
}
