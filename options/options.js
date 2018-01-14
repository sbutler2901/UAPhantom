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

// Displays saved popup for users
function savePopup() {
    alert("Options saved!");
}

// Saves user's options on submit
function saveOptions(e) {
    e.preventDefault();

    var shouldDisable = document.querySelector("#disabled").checked;
    var shouldChangeFreq = document.querySelector("#chng-freq-chk").checked;
    var changeFreqTime = Number.parseInt(document.querySelector("#chng-freq-time").value, 10);

    var shouldOSLinux = document.querySelector("#os-linux").checked;
    var shouldOSMac = document.querySelector("#os-mac").checked;
    var shouldOSWin = document.querySelector("#os-win").checked;

    var shouldBrowserFF = document.querySelector("#browser-ff").checked;
    var shouldBrowserChr = document.querySelector("#browser-chrome").checked;
    var shouldBrowserChrmium = document.querySelector("#browser-chromium").checked;
    var shouldBrowserSaf = document.querySelector("#browser-safari").checked;
    var shouldBrowserOp = document.querySelector("#browser-opera").checked;
    var shouldBrowserEdg = document.querySelector("#browser-edge").checked;
    var shouldBrowserIe = document.querySelector("#browser-ie").checked;
    
    if ( Number.isNaN(changeFreqTime) ||
        changeFreqTime < bgpage.changeFreqTimeMin ||
        changeFreqTime > bgpage.changeFreqTimeMax
    ) changeFreqTime = bgpage.defaultChangeFreq;

    // Updating storage
    // Note: keys must be strings (string variables aren't allowed)
    browser.storage.local.set({
        "should_change": shouldChangeFreq,
        "change_freq": changeFreqTime,
        "os_filter_linux":  shouldOSLinux,
        "os_filter_mac": shouldOSMac,
        "os_filter_win": shouldOSWin,
        "browser_filter_ff": shouldBrowserFF,
        "browser_filter_chrome": shouldBrowserChr,
        "browser_filter_chromium": shouldBrowserChrmium,
        "browser_filter_safari": shouldBrowserSaf,
        "browser_filter_opera": shouldBrowserOp,
        "browser_filter_edge": shouldBrowserEdg,
        "browser_filter_ie": shouldBrowserIe
    }).then(function () {

        // Check isDisabled change
        if ( shouldDisable != bgpage.isDisabled ) {
            if ( shouldDisable )
                bgpage.disable();
            else
                bgpage.enable();
        }
        //TODO:  Only run parser and update UAs if settings have changed
        bgpage.setAvailableUAs();
        savePopup();
    }, bgpage.onError);

}

// Restore's user's options on page load
function restoreOptions() {
    
    document.querySelector("#current-ua").innerText = bgpage.currentUA;

    browser.storage.local.get().then((res) => {
        
        document.querySelector("#disabled").checked = res[bgpage.skeyDisabled];
        document.querySelector("#chng-freq-chk").checked = res[bgpage.skeyShouldChange];

        if ( res[bgpage.skeyChangeFreq] === undefined ) 
            document.querySelector("#chng-freq-time").value = 0;
        else
            document.querySelector("#chng-freq-time").value = res[bgpage.skeyChangeFreq];
        
        document.querySelector("#os-linux").checked = res[bgpage.skeyOSLinux];
        document.querySelector("#os-mac").checked = res[bgpage.skeyOSMac];
        document.querySelector("#os-win").checked = res[bgpage.skeyOSWin];

        document.querySelector("#browser-ff").checked = res[bgpage.skeyBrowserFF];
        document.querySelector("#browser-chrome").checked = res[bgpage.skeyBrowserChr];
        document.querySelector("#browser-chromium").checked = res[bgpage.skeyBrowserChrmium];
        document.querySelector("#browser-safari").checked = res[bgpage.skeyBrowserSaf];
        document.querySelector("#browser-opera").checked = res[bgpage.skeyBrowserOp];
        document.querySelector("#browser-edge").checked = res[bgpage.skeyBrowserEdg];
        document.querySelector("#browser-ie").checked = res[bgpage.skeyBrowserIE];
 
    }, bgpage.onError);
}
