'use strict';


//********************* Global variables *********************

var isDisabled;

var defaultIsDisabled = false;
var defaultShouldChange = true;
var defaultChangeFreq = 30;
var defaultOS = true;
var defaultBrowser = true;
var changeFreqTimeMin = 1;
var changeFreqTimeMax = 60;

const baEnabledIconPath = "icons/PhantomGreen-96.png";
const baDisabledIconPath = "icons/PhantomRed-96.png";

// storage keys
var skeyDisabled = "disabled";
var skeyShouldChange = "should_change";
var skeyChangeFreq = "change_freq";
var skeyOSLinux = "os_filter_linux";
var skeyOSMac = "os_filter_mac";
var skeyOSWin = "os_filter_win";
var skeyBrowserFF = "browser_filter_ff";
var skeyBrowserChr = "browser_filter_chrome";
var skeyBrowserSaf = "browser_filter_safari";
var skeyBrowserOp = "browser_filter_opera";
var skeyBrowserEdg = "browser_filter_edge";
var skeyBrowserIE = "browser_filter_ie";

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

// Gets whether spoofing is enabled or disable and sets global value
function initDisabled() {
    browser.storage.local.get(skeyDisabled).then((res) => {
        if ( res[skeyDisabled] === undefined )
            isDisabled = defaultIsDisabled;
        else
            isDisabled = res[skeyDisabled];

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
        skeyDisabled: true
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
        skeyDisabled: false
    }).then(() => {

        isDisabled = false;
        setExtensionState();

        if ( callback !== undefined )
            callback(isDisabled);

    }, onError);
}

// Used to ensure that the local storage is in a usable initial state
function checkStorageState() {
    browser.storage.local.get().then((res) => {

        if ( res[skeyDisabled] === undefined )
            browser.storage.local.set({
                skeyDisabled: defaultIsDisabled
            }).catch(onError);

        if ( res[skeyShouldChange] === undefined )
            browser.storage.local.set({
                skeyShouldChange: defaultShouldChange
            }).catch(onError);

        if ( res[skeyChangeFreq] === undefined )
            browser.storage.local.set({
                skeyChangeFreq: defaultChangeFreq
            }).catch(onError);

        if ( res[skeyOSLinux] === undefined )
            browser.storage.local.set({
                skeyOSLinux: defaultOS
            }).catch(onError);

        if ( res[skeyOSMac] === undefined )
            browser.storage.local.set({
                skeyOSMac: defaultOS
            }).catch(onError);

        if ( res[skeyOSWin] === undefined )
            browser.storage.local.set({
                skeyOSWin: defaultOS
            }).catch(onError);

        if ( res[skeyBrowserFF] === undefined )
            browser.storage.local.set({
                skeyBrowserFF: defaultBrowser
            }).catch(onError);

        if ( res[skeyBrowserChr] === undefined )
            browser.storage.local.set({
                skeyBrowserChr: defaultBrowser
            }).catch(onError);
        
        if ( res[skeyBrowserSaf] === undefined )
            browser.storage.local.set({
                skeyBrowserSaf: defaultBrowser
            }).catch(onError);
    
        if ( res[skeyBrowserOp] === undefined )
            browser.storage.local.set({
                skeyBrowserSaf: defaultBrowser
            }).catch(onError);

        if ( res[skeyBrowserEdg] === undefined )
            browser.storage.local.set({
                skeyBrowserEdg: defaultBrowser
            }).catch(onError);
       
        if ( res[skeyBrowserIE] === undefined )
            browser.storage.local.set({
                skeyBrowserEdg: defaultBrowser
            }).catch(onError);
    });
}


//********** Perodic UA change / alarms **********

// Starts the extensions alarm for periodically changing UA
function initPeriodicChange() {
    if ( !isDisabled ) {
        browser.storage.local.get([skeyShouldChange, skeyChangeFreq]).then((res) => {
            if ( res[skeyShouldChange] ) {
                browser.alarms.create("ua-change-alarm", {
                    periodInMinutes: res[skeyChangeFreq]
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

