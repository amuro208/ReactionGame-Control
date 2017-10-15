var tcsRegi = {}
var flagTxt = ["Australia","England","Jamaica","Malawi","New Zealand","South Africa"];
var users = [];

tcsRegi.selectedFlag = -1;
tcsRegi.selectedUser = 0;
tcsRegi.users = [];
tcsRegi.cbChecked = [true,true,false];
tcsRegi.cbMandatory = [true,true,false];
tcsRegi.forms = ["userFirstName","userLastName","userEmail","userMobile","userFlag","userPostcode","userOption1","userOption1","userOption2","userOption3",""];

	tcsRegi.init = function(){
		  document.addEventListener("onSocketMessage",this.onSocketMessage);

			for(var i=0;i<multiUser;i++){
				this.users[i] = new User();
			}


			if(multiUser == 1){
				/* Not use full-popup option*/
				$$("app-page-body").innerHTML = $$("userInputBody").innerHTML;
				$$("userInputBody").innerHTML = "";
			}
			if(!useFlag){
				$$("userFlags").style.display = "none";
			}else{
				this.flagSetting();
			}

			this.formReset(-1);
			this.dataReset();
			this.userStatus();
			//$$("usermain").style.display = "table";
	}



	tcsRegi.onSocketMessage = function(e){
		if(e.detail.cmd == "USERDATA_RECEIVED"){
			openFullPopup('thankYou');
			setTimeout(closeFullPopup,1000,'thankYou');
			tcsRegi.formReset(-1);
		}
	}

	tcsRegi.mouseClickOnFlag = function(e){
		//log("HEY HEY"+e.currentTarget);
		tcsRegi.flagSelect(parseInt(e.currentTarget.id.substring(4)));
	}
	tcsRegi.flagSelect = function(n){
	if(!useFlag)return false;
	log("flagSelect : "+n);

	if(n != NaN){
		if(tcsRegi.selectedFlag>-1){$$("flag"+tcsRegi.selectedFlag).className = "flag";}
		if(n>-1){$$("flag"+n).className = "flag flag-selected";}
		}
		tcsRegi.selectedFlag = n;
	}

	tcsRegi.flagSetting = function(){

		var index = 0;
		for(var i = 0;i<2;i++){
			for(var j = 0;j<3;j++){
				var flag  = document.createElement("DIV");
				var img   = document.createElement("IMG");
				var badge = document.createElement("IMG");
				var txt   = document.createElement("DIV");
				flag.className = "flag";
				img.className = "img";
				txt.className = "txt";
				badge.className = "badge";
				flag.setAttribute("id", "flag"+index);
				badge.src = "./img/checked.png";
				img.src = "./img/flags/flag"+(index+1)+".png";
				txt.innerHTML = flagTxt[index];
				flag.appendChild(img);
				flag.appendChild(badge);
				flag.appendChild(txt);
				flag.addEventListener("mouseup",this.mouseClickOnFlag);
				flag.addEventListener("touchend",this.mouseClickOnFlag);
				$$("flagContainer").appendChild(flag);

				index++;
			}

		}
	}
	tcsRegi.dataReset = function(){
		for(var i=0;i<multiUser;i++){
			var user = this.users[i];
			user.reset();
			user.print();
		}
	}
	tcsRegi.reset = function(){
		this.formReset();
		this.dataReset();
		this.userStatus();

	}
	tcsRegi.userStatus = function(){
		if(multiUser == 1)return;
		var bool = true;
		for(var i=0;i<multiUser;i++){
			var user = this.users[i];
			if(user.check == true ){
				bool = false;
				//$$("userBtn"+i).className = "btn btn-lg btn-primary";
			}else{
				//$$("userBtn"+i).className = "btn btn-lg btn-default";
			}
		}

		$$("btn-reset").disabled = bool;
		$$("btn-submit").disabled = bool;
	}
	tcsRegi.formReset = function(){
		if(this.isForm("userFirstName"))$$("userFirstName").value = "";
		if(this.isForm("userFirstName"))$$("userLastName").value = "";
		if(this.isForm("userEmail"))$$("userEmail").value = "";
		if(this.isForm("userFlag"))this.flagSelect(-1);
		if(this.isForm("userMobile"))$$("userMobile").value = "";
		if(this.isForm("userPostcode"))$$("userPostcode").value = "";
		this.checkReset(false);

	}


  tcsRegi.defaultUser = [
{"fname":"Amuro",  "lname":"Lee",         "email":"amuro208@gmail.com",               "flag":1, "mobile":"0443399887","post":"2016"},
{"fname":"Miyoung","lname":"Kang",        "email":"miyoung.kang@gmail.com",           "flag":2, "mobile":"0465123431","post":"2022"},
{"fname":"Marcus", "lname":"Joy",         "email":"marcus.joy@thecreativeshop.com.au","flag":3, "mobile":"0476761123","post":"2065"},
{"fname":"Luis",   "lname":"Youn",        "email":"yhy2015@gmail.com",                "flag":4, "mobile":"0444433334","post":"2000"},
{"fname":"David",  "lname":"Wommelsdorff","email":"david@gmail.com",                  "flag":5, "mobile":"0412233432","post":"2011"}];

	tcsRegi.defaultPunchin = function(){
		var obj = tcsRegi.defaultUser[Math.floor(Math.random() * tcsRegi.defaultUser.length)];
		if(this.isForm("userFirstName"))$$("userFirstName").value = obj.fname;
		if(this.isForm("userFirstName"))$$("userLastName").value = obj.lname;
		if(this.isForm("userEmail"))$$("userEmail").value = obj.email;
		if(this.isForm("userFlag"))this.flagSelect(obj.flag);
		if(this.isForm("userMobile"))$$("userMobile").value = obj.mobile;
		if(this.isForm("userPostcode"))$$("userPostcode").value = obj.post;

	}
	tcsRegi.checkReset = function(b){
		if(b){
			var user = this.users[this.selectedUser];
			for(var i=0;i<this.cbChecked.length;i++){
				$$("userOption"+(i+1)).checked =user["userOption"+(i+1)];
			}
		}else{
			for(var i=0;i<this.cbChecked.length;i++){
				$$("userOption"+(i+1)).checked =this.cbChecked[i];
			}
		}


	}
	tcsRegi.openInput = function(n){
		this.selectedUser = n;
		var user = this.users[this.selectedUser];
		if(user.check){
			if(this.isForm("userFirstName"))$$("userFirstName").value = user.userFirstName;
			if(this.isForm("userFirstName"))$$("userLastName").value = user.userLastName;
			if(this.isForm("userEmail"))$$("userEmail").value = user.userEmail;
			if(this.isForm("userFlag"))this.flagSelect(user.userFlag);
			if(this.isForm("userMobile"))$$("userMobile").value = user.userMobile;
			if(this.isForm("userPostcode"))$$("userPostcode").value = user.userPostcode;
			this.checkReset(true);

		}else{
			this.formReset();
		}
		$$("userInputTitle").innerHTML = "PLAYER"+(n+1);
		openFullPopup('userInput');
	}

	tcsRegi.delete = function(){
		var user = this.users[this.selectedUser];
		user.reset();
		this.formReset();
		this.userStatus();
		closeFullPopup('userInput');
	}

  tcsRegi.isForm = function(s){
		if(this.forms.indexOf(s)>-1)return true;
		else return false;
	}

  tcsRegi.punchIn = function(){

		var user = this.users[this.selectedUser];
		var value;
		if(this.isForm("userFirstName")){
			value = $$("userFirstName").value;
			if(value == "" || specialCharChk(value)){alert("Check your first name");return false};
			user.userFirstName = value;
		}
		if(this.isForm("userLastName")){
				value = $$("userLastName").value;
				if(value == "" || specialCharChk(value)){alert("Check your last name");return false};
				user.userLastName = value;
			}
		if(this.isForm("userEmail")){
				value = $$("userEmail").value;
				if(value == "" || !emailMalformedChk(value)){alert("Check your email address");return false};
				user.userEmail = value;
			}
		if(this.isForm("userFlag")){
				if(useFlag && tcsRegi.selectedFlag<0){alert("Please select your team");return false};
				user.userFlag = tcsRegi.selectedFlag;
			}
		if(this.isForm("userMobile")){
				value = $$("userMobile").value;
				if(value == "" || !mobileMalformedChk(value)){alert("Check your mobile number");return false};
				user.userMobile = value;
			}
		if(this.isForm("userPostcode")){
				value = $$("userPostcode").value;
				if(value == "" || !postCodeformedChk(value)){alert("Check your postcode");return false};
				user.userPostcode = value;
			}
		if(this.isForm("userOption1")){
				user.userOption1 = $$("userOption1").checked;
				if(this.cbMandatory[0] && !user.userOption1){alert("Check terms and condition");return false};
			}
		if(this.isForm("userOption2")){
				user.userOption2 = $$("userOption2").checked;
				if(this.cbMandatory[1] && !user.userOption2){alert("Check terms and condition");return false};
			}
		if(this.isForm("userOption3")){
				user.userOption3 = $$("userOption3").checked;
				if(this.cbMandatory[2] && !user.userOption2){alert("Check terms and condition");return false};
			}

		user.check = true;
		closeFullPopup('userInput');
		this.userStatus();
		return true;
	}
  tcsRegi.getFormValues = function(key){
		var values = "";
		for(var i = 0;i<this.users.length;i++){
			var user = this.users[i];
			values+=user[key];
			if(i<this.users.length-1){
				values+="|";
			}
		}
		console.log(this.users.length+" : "+key+" : "+values);
		return values;
	}

	tcsRegi.submit = function(){
		if(multiUser == 1){
			if(!this.punchIn())return;
		}
		var userFirstName = this.getFormValues("userFirstName");
		var userLastName = this.getFormValues("userLastName");
		var userEmail = this.getFormValues("userEmail");
		var userMobile = this.getFormValues("userMobile");
		var userFlag = this.getFormValues("userFlag");
		var userPostcode = this.getFormValues("userPostcode");
		var userOption1 = this.getFormValues("userOption1");
		var userOption2 = this.getFormValues("userOption2");
    var userOption3 = this.getFormValues("userOption3");

		tcssocket.send("ALL","USERDATA",userFirstName+","+userLastName+","+userEmail+","+userFlag+","+userMobile+","+userPostcode+","+userOption1+","+userOption2+","+userOption3);
		//"userFirstName,userLastName,userEmail,userFlag,userMobile,userPostcode,userOption1,userOption2
	}
	// tcsRegi.terms = ['<embed  src="http://docs.google.com/viewer?url=http://203.191.181.166/projects/terms/terms.pdf&embedded=true" class="scrollable" style="border:5px dashed #FF0000;width:500px;height:100%"></embed >'
	// ,'<embed  src="http://203.191.181.166/projects/terms/terms.html" width=800px height=500px></embed >'
	// ,'<embed  src="http://docs.google.com/viewer?url=http://203.191.181.166/projects/terms/terms.docx&embedded=true" width=800px height=500px></embed >']
tcsRegi.terms = ['<iframe src="./terms/terms.html"  width="95%" height="100%" style="border: none;overflow:hidden"></iframe>'
,'<iframe src="./terms/terms_pdf.html/terms.html"   width="95%" height="100%" style="border: none;overflow:hidden"></iframe>'
,'<iframe src="./terms/terms.docx"                  width="95%" height="100%" style="border: none;overflow:hidden"></iframe>']

	tcsRegi.tabActionTerms = function(n){
		var src = this.terms[n];
		$$("termsDisplay").innerHTML = src;
		var tab = $$("termsTab");

		for(var i = 0;i<tab.children.length;i++){
			if(i == n){
				console.log("tab.children. active : "+i+"/"+tab.children.length);
				tab.children[i].classList.add("active");
			}
			else tab.children[i].classList.remove("active");
		}


	}
	tcsRegi.showTerms = function(n){
		openFullPopup('userTerms');
   tcsRegi.tabActionTerms(n);
		// var xhr = new XMLHttpRequest();
		// xhr.onreadystatechange = function() {
		//   if(xhr.readystate == 4 && xhr.status == 200) {
		//     $$('displayDiv').innerHTML = xhr.responseText;
		//
		//   }
		// };
		// xhr.open('GET', './terms2.html', true);
		// xhr.send();
	}
