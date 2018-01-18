  var parseXml;

  if (typeof window.DOMParser != "undefined") {
      parseXml = function(xmlStr) {
          return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
      };
  } else if (typeof window.ActiveXObject != "undefined" &&
         new window.ActiveXObject("Microsoft.XMLDOM")) {
      parseXml = function(xmlStr) {
          var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async = "false";
          xmlDoc.loadXML(xmlStr);
          return xmlDoc;
      };
  } else {
      throw new Error("No XML parser found");
  }
  console.log("parseXml : "+parseXml);

  function $$(id){ return document.getElementById(id); }
  function clearlog(){
    app.debug.debugTxtArea.innerHTML = "";
  }
  function log(msg){
    console.log(msg);
    var txtarea = app.debug.debugTxtArea;
    txtarea.innerHTML+="\n"+msg;
    txtarea.scrollTop  =txtarea.scrollHeight;
  }

  function toggleOnOff(id){
    if($$(id).style.display == "block"){
      $$(id).style.display = "none";
    }else{
      $$(id).style.display = "block";
    }
  }


  function openFullPopup(id){
  		$$(id).style.display = "block";
  		//ispopup = true;
  	}
  function closeFullPopup(id){
  		$$(id).style.display = "none";
  		//ispopup = false;
  	}


  function importScript(url){
    var imported = document.createElement('script');
    imported.src = url;
    document.head.appendChild(imported);
  }
