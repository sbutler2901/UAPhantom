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
        removePeriodicChange();

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
        initPeriodicChange();

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

function removePeriodicChange() {
    //browser.alarms.clear("ua-change-alarm");
    browser.alarms.clearAll();

    // Listener receives any alarm
    browser.alarms.onAlarm.removeListener(handleAlarms);
}

function handleAlarms(alarmInfo) {
    if ( alarmInfo.name == "ua-change-alarm" )
        getNewUA();
}

function initPeriodicChange() {
    if ( !isDisabled ) {
        browser.storage.local.get(["should_change_freq", "change_freq_time"]).then((res) => {
            if ( res.should_change_freq ) {
                browser.alarms.create("ua-change-alarm", {
                    periodInMinutes: res.change_freq_time
                });
                browser.alarms.onAlarm.addListener(handleAlarms);
            }
        }, onError);
    }
}

// Global variables to be used throughout extension
var shouldDebug = false;
var isDisabled;
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
