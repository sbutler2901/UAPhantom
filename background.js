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

function updateBrowserActionIcon() {
    if ( isDisabled )
        browser.browserAction.setIcon({path: baDisabledIconPath});
    else
        browser.browserAction.setIcon({path: baEnabledIconPath});
}

// Enables spoofing and passes isDisabled (true) to callback
function disable(callback) {
    browser.storage.local.set({
        disabled: true
    }).then(() => {

        isDisabled = true;
        updateBrowserActionIcon();

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
        updateBrowserActionIcon();

        if ( callback !== undefined )
            callback(isDisabled);

    }, onError);
}

// Gets whether spoofing is enabled or disable and sets global value
function getDisabled() {
    browser.storage.local.get("disabled").then((res) => {
        isDisabled = res.disabled;
        if ( isDisabled ) 
            browser.browserAction.setIcon({path: baDisabledIconPath});
        else
            browser.browserAction.setIcon({path: baEnabledIconPath});
    });
}

//The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function excludeOtherOSes() {
    //ualog("excluding OSes");
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
        //"should_only_use_same_device",
        "should_only_use_same_os",
        "should_only_use_same_browser"]).then((res) => {

            /*if ( res.should_only_use_same_device ) {
            }*/
            if ( res.should_only_use_same_os ) {
                excludeOtherOSes();
            }
            if ( res.should_only_use_same_browser ) {
                excludeOtherBrowsers();
            }

            onlySameOS = res.should_only_use_same_os;
            onlySameBrowser = res.should_only_use_same_browser;
            getNewUA();

    }, onError);
}

function removePeriodicChange() {
    //browser.alarms.clear("ua-change-alarm");
    browser.alarms.clearAll();
    browser.alarms.onAlarm.removeListener(handleUAChangeAlarm);
}

function handleUAChangeAlarm(alarmInfo) {
    getNewUA();
}

function initPeriodicChange() {
    browser.storage.local.get(["should_change_freq", "change_freq_time"]).then((res) => {
        if ( res.should_change_freq ) {
            browser.alarms.create("ua-change-alarm", {
                periodInMinutes: res.change_freq_time
            });
            browser.alarms.onAlarm.addListener(handleUAChangeAlarm);
        }
        isPeriodicAlarmActive = res.should_change_freq;

    }, onError);
}

function getNewUA() {
    if ( availableUAs.length < 2 ) {
        currentUA = userAgents[ getRandomInt(0, userAgents.length) ];
        //ualog("Number of UA's inadequate for expected privacy. Ignoring filters!");
    } else
        currentUA = availableUAs[ getRandomInt(0, availableUAs.length) ];
}

var shouldDebug = false;
var currentUA;
var availableUAs = [];
var isDisabled;
var isPeriodicAlarmActive;
var onlySameOS;
var onlySameBrowser;
const baEnabledIconPath = "icons/PhantomGreen.png";
const baDisabledIconPath = "icons/PhantomRed.png";

getDisabled();
setAvailableUAs();
initPeriodicChange();

browser.webRequest.onBeforeSendHeaders.addListener(
  rewriteUserAgentHeader,
  {urls: ["<all_urls>"]},
  ["blocking", "requestHeaders"]
);
