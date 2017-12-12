'use strict';

function ualog(content) {
  console.log("UASpoofer: " + content);
}

function onError(error) {
  ualog('Error: ${error}');
}

function rewriteUserAgentHeader(e) {
    if ( !isDisabled ) {
        for (var header of e.requestHeaders) {
            if (header.name.toLowerCase() == "user-agent") {
                header.value = currentUA;
            }
        }
    }
    return {requestHeaders: e.requestHeaders};
}

// Enables spoofing and passes isDisabled (true) to callback
function disable(callback) {
    browser.storage.local.set({
        disabled: true
    }).then(() => {

        isDisabled = true;
        if ( callback !== undefined )
            callback(isDisabled);

    }, onError);
}

// Enables spoofing and passes isDisabled (false) to callback
function enable(callback) {
    browser.storage.local.set({
        disabled: false
    }).then(() => {

        isDisabled = false;
        if ( callback !== undefined )
            callback(isDisabled);

    }, onError);
}

// Gets whether spoofing is enabled or disable and sets global value
function getDisabled() {
    browser.storage.local.get("disabled").then((res) => {
        isDisabled = res.disabled;
    });
}

//The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function excludeOtherOSes() {
    if ( navigator.oscpu.includes("Mac") ) {

        userAgents.forEach(function (item, index, array) {
            if ( item.includes("Macintosh") )
                availableUAs.push(item);
        });

    } else if ( naviagtor.oscpu.includes("Win") ) {

        userAgents.forEach(function (item, index, array) {
            if ( item.includes("Windows") )
                availableUAs.push(item);
        });

    } else if ( navigator.oscpu.includes("Linux") ) {

        userAgents.forEach(function (item, index, array) {
            if ( item.includes("Linux") )
                availableUAs.push(item);
        });

    } else {
        ualog("Unknown OS. Ignoring Setting");
    }
}

function excludeOtherBrowsers() {

}

function setAvailableUAs() {
    browser.storage.local.get([
        "should_only_use_same_device",
        "should_only_use_same_os",
        "should_only_use_same_browser"]).then((res) => {

            /*if ( res.should_only_use_same_device ) {
            }*/
            if ( res.should_only_use_same_os ) {
                excludeOtherOSes();
            }
            if ( res.should_only_use_same_browser ) {
                exlcludeOtherBrowsers();
            }

        }, onError);
}

function getNewUA() {
    if ( availableUAs.length < 2 ) {
        currentUA = userAgents[ getRandomInt(0, userAgents.length) ];
        ualog("Number of UA's inadequate for expected privacy. Ignoring filters!");
    } else {
        currentUA = availableUAs[ getRandomInt(0, availableUAs.length) ];
    }
    /*ualog(navigator.platform);
    ualog(navigator.oscpu);
    ualog(navigator.appVersion);*/
    /*userAgents.forEach(function(item, index, array) {
      ualog(index + ": " + item);
    });*/
}

var shouldDebug = false;
var currentUA;
var availableUAs = [];
var isDisabled;

getDisabled();
setAvailableUAs();
getNewUA();

browser.webRequest.onBeforeSendHeaders.addListener(
  rewriteUserAgentHeader,
  {urls: ["<all_urls>"]},
  ["blocking", "requestHeaders"]
);
