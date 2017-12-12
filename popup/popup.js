
function ualog(content) {
    console.log("UASpoofer: " + content);
}

function onError(error) {
    ualog('Error: ${error}');
}

function openSettings() {
    browser.runtime.openOptionsPage();
}

// tmp ua
var bgpage = browser.extension.getBackgroundPage();

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#disable-btn").addEventListener("click", bgpage.disable);
  document.querySelector("#new-ua-btn").addEventListener("click", bgpage.getNewUA);
  document.querySelector("#settings-btn").addEventListener("click", function () {
    browser.runtime.openOptionsPage();
  });

  bgpage.getDisabled(function (isDisabled) {
    var isDisabledString = "UASpoofer: spoofing!";
    if ( isDisabled )
      isDisabledString = "UASpoofer: currently disabled";
    else
    document.querySelector("#is-disabled").innerText = isDisabledString;
  });
});
