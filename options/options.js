'use strict';


//********************* Local variables *********************

const bgpage = browser.extension.getBackgroundPage();


//********************* Init *********************

init();


//********************* Function Declarations *********************

// Initializes the page
function init() {
    document.addEventListener("DOMContentLoaded", restoreOptions);
    document.querySelector("form").addEventListener("submit", saveOptions);
}

// Saves user's options on submit
function saveOptions(e) {
    var shouldDisable, shouldChangeFreq, changeFreqTime, shouldSameOS, shouldSameBrowser;
    
    e.preventDefault();

    shouldDisable = document.querySelector("#disabled").checked;
    shouldChangeFreq = document.querySelector("#chng-freq-chk").checked;
    shouldSameOS = document.querySelector("#same-os").checked;
    shouldSameBrowser = document.querySelector("#same-browser").checked;

    changeFreqTime = Number.parseInt(document.querySelector("#chng-freq-time").value, 10);
    if ( Number.isNaN(changeFreqTime) ||
        changeFreqTime < bgpage.changeFreqTimeMin ||
        changeFreqTime > bgpage.changeFreqTimeMax
    ) changeFreqTime = bgpage.defaultChangeFreq;

    // Updating storage
    browser.storage.local.set({
        should_change_freq: shouldChangeFreq,
        change_freq_time: changeFreqTime,
        should_only_use_same_os: shouldSameOS,
        should_only_use_same_browser: shouldSameBrowser
    }).then(function () {

        // Check isDisabled change
        if ( shouldDisable != bgpage.isDisabled ) {
            if ( shouldDisable )
                bgpage.disable();
            else
                bgpage.enable();
        }

        // Only run parser and update UAs if settings have changed
        if ( shouldSameOS != bgpage.onlySameOS || shouldSameBrowser != bgpage.onlySameBrowser )
            bgpage.setAvailableUAs();

    }, bgpage.onError);

}

// Restore's user's options on page load
function restoreOptions() {

    browser.storage.local.get(["disabled", "should_change_freq",
        "change_freq_time", "should_only_use_same_os",
        "should_only_use_same_browser"]).then((res) => {

        var isDisabled = bgpage.defaultIsDisabled;
        var shouldChange = bgpage.defaultShouldChange;
        var shouldChangeFreq = bgpage.defaultChangeFreq;
        var shouldSameOS = bgpage.defaultShouldSameOS;
        var shouldSameBrowser = bgpage.defaultShouldSameBrowser;

        // Handle storage in inconsistent state. Possibly due to
        // browser storage being disabled
        if ( res.disabled !== undefined )
            isDisabled = res.disabled;

        if ( res.should_change_freq !== undefined )
            shouldChange = res.should_change_freq;

        if ( res.change_freq_time !== undefined )
            shouldChangeFreq = res.change_freq_time;

        if ( res.should_only_use_same_os !== undefined )
            shouldSameOS  = res.should_only_use_same_os;

        if ( res.should_only_use_same_browser !== undefined )
            shouldSameBrowser = res.should_only_use_same_browser;

        document.querySelector("#disabled").checked = isDisabled;
        document.querySelector("#chng-freq-chk").checked = shouldChange;
        document.querySelector("#chng-freq-time").value = shouldChangeFreq;
        document.querySelector("#same-os").checked = shouldSameOS;
        document.querySelector("#same-browser").checked = shouldSameBrowser;

    }, bgpage.onError);

    document.querySelector("#current-ua").innerText = bgpage.currentUA;
}

