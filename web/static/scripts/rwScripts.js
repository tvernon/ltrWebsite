'use strict';
function selectActive() {
  var activeTab = window.location.pathname.substr(1) + "Tab";
  if (activeTab === "Tab") {
    activeTab = "homeTab";
  }
  $("#" + activeTab).parent().addClass("active");
  console.log(activeTab);
}