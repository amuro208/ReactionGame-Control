this.sendMessage = function (){
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
