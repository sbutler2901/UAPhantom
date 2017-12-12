function ualog(content) {
  console.log("UASpoofer: " + content);
}

function onError(error) {
  ualog('Error: ${error}');
}

function rewriteUserAgentHeader(e) {
  for (var header of e.requestHeaders) {
    if (header.name.toLowerCase() == "user-agent") {
      header.value = currentUA;
    }
  }
  return {requestHeaders: e.requestHeaders};
}

browser.webRequest.onBeforeSendHeaders.addListener(
  rewriteUserAgentHeader,
  {urls: ["<all_urls>"]},
  ["blocking", "requestHeaders"]
);

// Enables spoofing and passes isDisabled (true) to callback
function disable(callback) {
  browser.storage.local.set({
    disabled: true
  }).then(() => {
    callback(true);
  }, onError);
}

// Enables spoofing and passes isDisabled (false) to callback
function enable(callback) {
  browser.storage.local.set({
    disabled: false
  }).then(() => {
    callback(false);
  }, onError);
}

// Gets whether spoofing is enabled or disable
function getDisabled(callback) {
  browser.storage.local.get("disabled").then((res) => {
    callback(res.disabled);
  });
}

//The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getNewUA() {
    currentUA = userAgents[getRandomInt(0, userAgents.length)];
    //ualog(currentUA);
    /*userAgents.forEach(function(item, index, array) {
      ualog(index + ": " + item);
    });*/
}

var shouldDebug = false;
var defaultUserAgents = "Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16";
var currentUA;
