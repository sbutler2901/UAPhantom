
function ualog(content) {
    console.log("UASpoofer: " + content);
}

function onError(error) {
    ualog('Error: ${error}');
}

// Opens the extensions settings
function openSettings() {
    browser.runtime.openOptionsPage();
}

// Updates the html affected when spoofing is enabled / disabled
function updateIsDisabledUI(isDisabled) {
    var isDisabledString = "UASpoofer: spoofing!";

    if ( isDisabled ) {
        isDisabledString = "UASpoofer: currently disabled";
        document.querySelector("#disable-btn").innerText = "Enable";
        document.querySelector("#disable-btn > img").src = "../icons/disable.png";
        document.querySelector("#disable-btn").addEventListener("click", function enabling() {
            bgpage.enable(updateIsDisabledUI);
            this.removeEventListener("click", enabling);
        });
    } else {
        document.querySelector("#disable-btn").innerText = "Disable";
        document.querySelector("#disable-btn > img").src = "../icons/enable.png";
        document.querySelector("#disable-btn").addEventListener("click", function disabling() {
            bgpage.disable(updateIsDisabledUI);
            this.removeEventListener("click", disabling);
        });
    }

    document.querySelector("#is-disabled").innerText = isDisabledString;
}

// tmp ua
const bgpage = browser.extension.getBackgroundPage();

document.addEventListener("DOMContentLoaded", function () { 
    document.querySelector("#new-ua-btn").addEventListener("click", bgpage.getNewUA);
    document.querySelector("#settings-btn").addEventListener("click", function () {
        browser.runtime.openOptionsPage();
    });
    bgpage.getDisabled(updateIsDisabledUI);
});
