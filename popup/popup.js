
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
    var isDisabledString = "Spoofing!";
    var disabledNotifier = document.querySelector("#isdisabled-notifier");

    if ( isDisabled ) {
        isDisabledString = "Disabled";

        disabledNotifier.classList.add('disabled');
        disabledNotifier.classList.remove('enabled');
        document.querySelector("#disable-btn").innerText = "Enable";
        document.querySelector("#disable-img").src = "../icons/disable.png";
        document.querySelector("#disable-btn").addEventListener("click", function enabling() {
            bgpage.enable(updateIsDisabledUI);
            this.removeEventListener("click", enabling);
        });

    } else {
        disabledNotifier.classList.add('enabled');
        disabledNotifier.classList.remove('disabled');
        document.querySelector("#disable-btn").innerText = "Disable";
        document.querySelector("#disable-img").src = "../icons/enable.png";
        document.querySelector("#disable-btn").addEventListener("click", function disabling() {
            bgpage.disable(updateIsDisabledUI);
            this.removeEventListener("click", disabling);
        });
    }

    disabledNotifier.innerText = isDisabledString;
}

// tmp ua
const bgpage = browser.extension.getBackgroundPage();

document.addEventListener("DOMContentLoaded", function () { 
    document.querySelector("#new-ua-btn").addEventListener("click", bgpage.getNewUA);
    document.querySelector("#settings-btn").addEventListener("click", function () {
        browser.runtime.openOptionsPage();
    });
    updateIsDisabledUI(bgpage.isDisabled);
});
