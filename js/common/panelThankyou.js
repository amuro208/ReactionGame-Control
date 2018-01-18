var PanelThankyou = function(id){
  Page.call(this,id);
  this.dispalyObj.style.zIndex = 100000;
  this.init();
}

PanelThankyou.prototype = Object.create(Page.prototype);
PanelThankyou.prototype.constructor = PanelThankyou;
PanelThankyou.prototype.init = function(){
this.dispalyObj.innerHTML = '<div class="full-popup-inner">\
       <div id="thankYouBody">\
         <p style="font-size:4em;margin-top:80px;">THANK YOU</p>\
         <p style="font-size:2.7em;color:#EEE">FOR REGISTERING</p>\
         <p style="font-size:2.7em;color:#EEE;margin-top:60px;">\
           <img src="./img/flags/flag0.png"/>\
           <span style="padding-left:16px;vertical-align:bottom">AA</span></p>\
         <p style="font-size:2.7em;color:#EEE;margin-top:60px;">#NissanFast5</p>\
         <p style="font-size:2.7em;color:#EEE"> Queue position: 2</p>\
       </div>\
     </div>';
}


PanelThankyou.prototype.showMessage = function(){
  this.show();
  setTimeout(function(_this){
    _this.hide();
  },3000,this);
}
