function ualog(content) {
  console.log("UASpoofer: " + content);
}

function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    color: document.querySelector("#color").value,
    user_agents: document.querySelector("#ua-textarea").value
  });
  ualog("textarea: " + document.querySelector("#ua-textarea").value);
  alert("textarea: " + document.querySelector("#ua-textarea").value);
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#color").value = result.color || "blue";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("color");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);


