var Page = function(id){
  this.dispalyObj = document.getElementById(id);
  console.log("Page initialise with display id : "+id);
  console.log("Page dispalyObj : "+this.dispalyObj);
}

Page.prototype.init = function(){

}
Page.prototype.ready = function(){

}
Page.prototype.start = function(){

}
Page.prototype.stop = function(){

}
Page.prototype.clear = function(){

}
Page.prototype.hide = function(){
  this.dispalyObj.style.display = "none";
}
Page.prototype.show = function(){
  this.dispalyObj.style.display = "block";
}
