'use strict';
window.onload = function () {
  $("#male").click(toggle);
  $("#female").click(toggle);
}


function checkForm () {
  var valid = true;
  var textInputs = $('[type=text]');
  var passwordInputs = $('[type=password]');
  textInputs.map(function () {

    if ($(this).val() === "") {
      console.log("SHOW THIS ALERT:")
      console.log(this.placeholder + " must be filled out.");
      valid = false;
    }
  });

  passwordInputs.map(function () {
    if ($(this).val() === "") {
      console.log("SHOW THIS ALERT:")
      console.log("Password must be filled out.");
      valid = false;
    }
  });

  if (passwordInputs.length > 1) {
    if ($(passwordInputs[0]).val() != $(passwordInputs[1]).val()) {
      console.log("SHOW THIS ALERT:");
      console.log("Passwords must match.");
      console.log("Clear the password fields");
      valid = false;
    }
  }
  return valid;
}

function toggle () {
  $('#gender').val(this.id);
  console.log($('#gender').val())
}