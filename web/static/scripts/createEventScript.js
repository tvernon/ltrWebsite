"use strict";
function checkForm () {
  var valid = true;
  var textInputs = $('[type=text]');

  textInputs.map(function () {

    if ($(this).val() === "") {
      console.log("SHOW THIS ALERT:")
      console.log(this.placeholder + " must be filled out.");
      valid = false;
    }
  });

  return valid;
}
