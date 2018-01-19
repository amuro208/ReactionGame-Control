
var cms = {};

cms.gameApprove = function(target,obj,fnc){
  var cmsURL = "http://"+tcsapp.conf.CMS_IP+tcsapp.conf.CMS_UPLOAD;
  log("cmsURL "+cmsURL);

  postAjax(cmsURL, obj, function(readyState,status,data){
    if(readyState == 4){
        if(status == 200){
            fnc(data);
        }else if(status == 404){
          alert("404 Page Not Found");
        }else if(status == 500){
          alert("500 Internal Server Error");
        }else{
          alert("Unknown Error");
        }

    }
  }.bind(target));
}

cms.getListData = function(target,obj,fnc){

}


cms.getQueue = function(target,obj,fnc){
   var cmsURL = "http://"+tcsapp.conf.CMS_IP+tcsapp.conf.CMS_REQUEST_QUEUE;
   log("cmsURL "+cmsURL);

     postAjax(cmsURL, {}, function(readyState,status,data){
       if(readyState == 4){
           if(status == 200){
             fnc(data);
           }else if(status == 404){
             alert("404 Page Not Found");
           }else if(status == 500){
             alert("500 Internal Server Error");
           }else{
             alert("Unknown Error");
           }
       }
     }.bind(target));

}

cms.saveQueue = function(target,obj,fnc){
  var cmsURL = "http://"+tcsapp.conf.CMS_IP+tcsapp.conf.CMS_SAVE_QUEUE;

  log("cmsURL "+cmsURL);

    postAjax(cmsURL, obj, function(readyState,status,data){
      if(readyState == 4){
          if(status == 200){
              fnc(data);
          }else if(status == 404){
              alert("404 Page Not Found");
          }else if(status == 500){
              alert("500 Internal Server Error");
          }else{
              alert("Unknown Error");
          }
      }
    }.bind(target));
}

cms.clearBoard = function(target,obj,fnc){
    var cmsURL = "http://"+tcsapp.conf.CMS_IP+tcsapp.conf.CMS_CLEAR_BOARD;
    postAjax(cmsURL, {}, function(readyState,status,data){
      if(readyState == 4){
        if(status == 200){

            fnc(data);
        }else if(status == 404){
            alert("404 Page Not Found");
        }else if(status == 500){
            alert("500 Internal Server Error");
        }else{
            alert("Unknown Error");
        }
      }
    }.bind(target));

}








function getAjax(url, result) {
   var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
   xhr.open('GET', url);
   xhr.onreadystatechange = function() {
      result(xhr.readyState,xhr.status,xhr.responseText);
   };
   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
   xhr.send();
   return xhr;
}
function postAjax(url, data, result) {
   var params = typeof data == 'string' ? data : Object.keys(data).map(
           function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
       ).join('&');

   var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
   xhr.open('POST', url);
   xhr.onreadystatechange = function() {
      result(xhr.readyState,xhr.status,xhr.responseText);
   };
   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   xhr.send(params);
   return xhr;
}

/* String Utils*/

function  specialCharChk(str) {
  var regExpPattern = /[*|\":<>[\]{}`\\()';,#@&$]/;
  //var regExpPattern = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g
  return regExpPattern.test(str);
}

function  emailMalformedChk(emailStr) {
  var regExpPattern = /^[0-9a-zA-Z][-._a-zA-Z0-9]*@([0-9a-zA-Z][-._0-9a-zA-Z]*\.)+[a-zA-Z]{2,4}$/;
  return regExpPattern.test(emailStr);
}

function  mobileMalformedChk(str) {
  var result = true;
  if(str.length!=10) result = false;
  for(var i = 0; i<str.length; i++){
    var chkCode = str.charCodeAt(i);
    if(chkCode<48 || chkCode>57){
      if(chkCode != 45){
        result = false;
        break;
      }
    }
  }
  return result;
}

function  postCodeformedChk(str) {
  if(str.length!=4) return false;
  for(var i = 0; i<str.length ; i++){
    if(str.charCodeAt(i)<48 || str.charCodeAt(i) >57){
      return false;
    }
  }
  return true;
}

function hiddenText(str) {
  var arr = new Array();
  for(var i = 0;i<str.length;i++){
    if(str.charAt(i) == "-"){
      arr.push("-");
    }else{
      arr.push("*");
    }
  }
  return toStr(arr);
}



function  mobileNumberWithRule(str,isBackKey) {
  var arr = new Array();
  var j;
  var i;
  var index;
  var tmpStr = "";
  for(i=0;i<str.length;i++){
    for(j = 0;j<_mobileCheckRule.length;j++){
      index = _mobileCheckRule[j];
      if(i == index){
        if(!isBackKey || isBackKey && str.length>index)
          arr.push("-");
        continue;
      }
    }
    arr.push(str.charAt(i));
  }
  return tmpStr = toStr(arr);
}

var _mobileCheckRule;
function mobileCheckRule(str){
  var arr = new Array();
  var n = 0;
  for(var i=0;i<str.length;i++){
    if(str.charAt(i) == "-"){
      arr.push(i-n);
      n++;
    }
  }
  _mobileCheckRule =  arr;
}

function toStr(arr)
{
  var str = "";
  for(var k=0;k<arr.length;k++)
  {
    str+=arr[k];
  }
  return str;
}
