'use strict';

function setup () {
  var activeTab = window.location.pathname.substr(1) + "Tab";
  if (activeTab === "Tab") {
    activeTab = "homeTab";
  } else if (activeTab.indexOf('/') > -1) {
    activeTab = activeTab.substr(0, activeTab.indexOf('/')) + "Tab";
  }
  $("#" + activeTab).parent().addClass("active");
}

function loginPressed () {
  //Show login modal.
  $("#loginModal").show();
}