'use strict';

function ualog(content) {
    console.log("UASpoofer: " + content);
}

function onError(error) {
    ualog('Error: ${error}');
}

function printSavedOptions() {
    if ( bgpage.shouldDebug ) {
        ualog("Printing saved options");
        ualog("Storage set: disabled: " + document.querySelector("#disabled").checked);
        //ualog("Storage set: user agents: " + document.querySelector("#ua-textarea").value);
        ualog("Storage set: should freq: " + document.querySelector("#chng-freq-chk").checked);
        ualog("Storage set: freq interval: " + document.querySelector("#chng-freq-time").value);
        //ualog("Storage set: same device: " + document.querySelector("#same-device").checked);
        ualog("Storage set: same os: " + document.querySelector("#same-os").checked);
        ualog("Storage set: same browser: " + document.querySelector("#same-browser").checked);
        ualog("End");
    }
}

function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
        disabled: document.querySelector("#disabled").checked,
        //user_agents: document.querySelector("#ua-textarea").value,
        should_change_freq: document.querySelector("#chng-freq-chk").checked,
        change_freq_time: document.querySelector("#chng-freq-time").value,
        //should_only_use_same_device: document.querySelector("#same-device").checked,
        should_only_use_same_os: document.querySelector("#same-os").checked,
        should_only_use_same_browser: document.querySelector("#same-browser").checked
    }).then(printSavedOptions, onError);
}

function restoreOptions() {

    browser.storage.local.get("disabled").then((res) => {
        if ( bgpage.shouldDebug )
            ualog("Storage Get: disabled: " + res.disabled);

        if ( res.disabled === undefined )
            document.querySelector("#disabled").checked = defaultIsDisabled;
        else
            document.querySelector("#disabled").checked = res.disabled;
    }, onError);

    /*browser.storage.local.get("user_agents").then((res) => {
        if ( bgpage.shouldDebug )
            ualog("Storage Get: user agents: " + res.user_agents);

        if ( res.user_agents === undefined ) {
            document.querySelector("#ua-textarea").value = defaultUserAgents;
        } else {
            document.querySelector("#ua-textarea").value = res.user_agents;
        }
    }, onError);*/

    browser.storage.local.get("should_change_freq").then((res) => {
        if ( bgpage.shouldDebug )
            ualog("Storage Get: should freq: " + res.should_change_freq);

        if ( res.should_change_freq === undefined )
            document.querySelector("#chng-freq-chk").checked = defaultShouldChangeFreq;
        else
            document.querySelector("#chng-freq-chk").checked = res.should_change_freq;
    }, onError);

    browser.storage.local.get("change_freq_time").then((res) => {
        if ( bgpage.shouldDebug )
            ualog("Storage Get: freq interval: " + res.change_freq_time);

        if ( res.change_freq_time === undefined )
            document.querySelector("#chng-freq-time").value = defaultChangeFreq;
        else
            document.querySelector("#chng-freq-time").value = res.change_freq_time;
    }, onError);

    /*browser.storage.local.get("should_only_use_same_device").then((res) => {
        if ( bgpage.shouldDebug )
            ualog("Storage Get: same device: " + res.should_only_use_same_device);

        if ( res.should_only_use_same_device === undefined )
            document.querySelector("#same-device").checked = defaultShouldUseSameDevice;
        else
            document.querySelector("#same-device").checked = res.should_only_use_same_device;
    }, onError);*/

    browser.storage.local.get("should_only_use_same_os").then((res) => {
        if ( bgpage.shouldDebug )
            ualog("Storage Get: same os: " + res.should_only_use_same_os);

        if ( res.should_only_use_same_os === undefined )
            document.querySelector("#same-os").checked = defaultShouldUseSameOS;
        else
            document.querySelector("#same-os").checked = res.should_only_use_same_os;
    }, onError);

    browser.storage.local.get("should_only_use_same_browser").then((res) => {
        if ( bgpage.shouldDebug )
            ualog("Storage Get: same browser: " + res.should_only_use_same_browser);

        if ( res.should_only_use_same_browser === undefined )
            document.querySelector("#same-browser").checked = defaultShouldUseSameBrowser;
        else
            document.querySelector("#same-browser").checked = res.should_only_use_same_browser;
    }, onError);

    document.querySelector("#current-ua").innerText = bgpage.currentUA;
}

const bgpage = browser.extension.getBackgroundPage();

const defaultIsDisabled = false;
const defaultShouldChangeFreq = false;
const defaultChangeFreq = 30;
//const defaultShouldUseSameDevice = true;
const defaultShouldUseSameOS = false;
const defaultShouldUseSameBrowser = false;

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);


