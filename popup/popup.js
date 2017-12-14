'use strict';


//********************* Local variables *********************

const bgpage = browser.extension.getBackgroundPage();


//********************* Init *********************

init();


//********************* Function Declarations *********************

// Initializes the page
function init() {
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelector("#new-ua-btn").addEventListener("click", function () {
            bgpage.getNewUA();
            document.querySelector("#current-ua").innerText = bgpage.currentUA;
        });
        document.querySelector("#settings-btn").addEventListener("click", function () {
            browser.runtime.openOptionsPage();
        });
        updateIsDisabledUI(bgpage.isDisabled);
        document.querySelector("#current-ua").innerText = bgpage.currentUA;
    });
}

// Updates the page elements affected when spoofing is enabled / disabled
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
            this.removeEventListener("click", enabling);
            bgpage.enable(updateIsDisabledUI);
        });

    } else {
        disabledNotifier.classList.add('enabled');
        disabledNotifier.classList.remove('disabled');
        document.querySelector("#disable-btn").innerText = "Disable";
        document.querySelector("#disable-img").src = "../icons/enable.png";
        document.querySelector("#disable-btn").addEventListener("click", function disabling() {
            this.removeEventListener("click", disabling);
            bgpage.disable(updateIsDisabledUI);
        });
    }

    disabledNotifier.innerText = isDisabledString;
}
