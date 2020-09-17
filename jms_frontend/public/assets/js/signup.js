function sub() {
  var first = document.getElementById("ftnm").value;
  var last = document.getElementById("ltnm").value;
  var email = document.getElementById("el").value;
	var time = document.getElementById("tm").value;
	var position = document.getElementById("ps").value;
	var level = document.getElementById("lv").value;
  var user = document.getElementById("tt").value;
  var pass = document.getElementById("pd").value;
  var passr = document.getElementById("pdr").value;
  var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  if (first == 0 || last == 0 || email == 0 || user == 0 ||pass == 0 || passr == 0) {
    console.log("!1")
    alert("Error: \nPlease Fill All Fields")
    return(0)
  }
  if (pass != passr) {
    console.log("!2")
    document.getElementById("pd").value = "";
    document.getElementById("pdr").value = "";
    document.getElementById("pd").style.borderColor = "red";
    document.getElementById("pdr").style.borderColor = "red";
    alert("Error: \nPassword Does Not Match")
  }
  if (!(email).match(emailReg)) {
    alert("Error: \nInvalid Email")
    //not fixed
  }
  document.getElementsByTagName("signup")[0].submit();
  console.log(first, last, email, user, time, position, level)

}
