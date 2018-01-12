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


		
