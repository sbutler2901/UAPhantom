'use strict';


//********************* Global variables *********************

var shouldDebug = false;
var isDisabled;

var defaultIsDisabled = false;
var defaultShouldChange = true;
var defaultChangeFreq = 30;
var defaultShouldSameOS = false;
var defaultShouldSameBrowser = false;
var changeFreqTimeMin = 1;
var changeFreqTimeMax = 60;

const baEnabledIconPath = "icons/PhantomGreen-96.png";
const baDisabledIconPath = "icons/PhantomRed-96.png";


//********************* Init *********************

init();


//********************* Function Declarations *********************

function init() {
    checkStorageState();
    initDisabled();
    setAvailableUAs();
    initPeriodicChange();

    browser.webRequest.onBeforeSendHeaders.addListener(
      rewriteUserAgentHeader,
      {urls: ["<all_urls>"]},
      ["blocking", "requestHeaders"]
    );
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


//********** Extension State **********

// Used to ensure that the local storage is in a usable initial state
function checkStorageState() {
    browser.storage.local.get(["disabled", "should_change_freq",
        "change_freq_time", "should_only_use_same_os",
        "should_only_use_same_browser"]).then((res) => {

        if ( res.disabled === undefined )
            browser.storage.local.set({
                disabled: defaultIsDisabled
            }).catch(onError);

        if ( res.should_change_freq === undefined )
            browser.storage.local.set({
                should_change_freq: defaultShouldChange
            }).catch(onError);

        if ( res.change_freq_time === undefined )
            browser.storage.local.set({
                change_freq_time: defaultChangeFreq
            }).catch(onError);

        if ( res.should_only_use_same_os === undefined )
            browser.storage.local.set({
                should_only_use_same_os: defaultShouldSameOS
            }).catch(onError);

        if ( res.should_only_use_same_browser === undefined )
            browser.storage.local.set({
                should_only_use_same_browser: defaultShouldSameBrowser
            }).catch(onError);
    });
}

// Gets whether spoofing is enabled or disable and sets global value
function initDisabled() {
    browser.storage.local.get("disabled").then((res) => {
        if ( res.disabled === undefined )
            isDisabled = defaultIsDisabled;
        else
            isDisabled = res.disabled;

        setExtensionState();
    });
}

// Updates the extensions icon in the browser's toolbar based on extension state
function updateBrowserActionIcon() {
    if ( isDisabled )
        browser.browserAction.setIcon({path: baDisabledIconPath});
    else
        browser.browserAction.setIcon({path: baEnabledIconPath});
}

// Sets necessary extension attributes based on current state
function setExtensionState() {
    if ( isDisabled )
        removePeriodicChange();
    else
        initPeriodicChange();

    updateBrowserActionIcon();
}

// Enables spoofing and passes isDisabled (true) to callback
function disable(callback) {
    browser.storage.local.set({
        disabled: true
    }).then(() => {

        isDisabled = true;
        setExtensionState();

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
        setExtensionState();

        if ( callback !== undefined )
            callback(isDisabled);

    }, onError);
}


//********** Perodic UA change / alarms **********

// Starts the extensions alarm for periodically changing UA
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

// Removes any alarms and corresponding listeners set by extension
function removePeriodicChange() {
    //browser.alarms.clear("ua-change-alarm");
    browser.alarms.clearAll();

    // Listener receives any alarm
    browser.alarms.onAlarm.removeListener(handleAlarms);
}

// Handles an alarm being fired by browser
function handleAlarms(alarmInfo) {
    if ( alarmInfo.name == "ua-change-alarm" )
        getNewUA();
}


//********** Error / Debugging **********

function ualog(content) {
  console.log("UASpoofer: " + content);
}

function onError(error) {
  ualog('Error: ${error}');
}

