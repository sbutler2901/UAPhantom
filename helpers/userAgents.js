'use strict';

//********************* Local Variables *********************

var intermediateOSUAs = [];
var intermediateBrowserUAs = [];

//********************* Function Declarations *********************

// Gets a new user agent to be provided by extension when spoofing
function getNewUA() {
    if ( availableUAs.length < minAvailableUAs ) {
        availableUAs = [];
        defaultUAs.forEach( function (item) {
            availableUAs.push(item.ua);
        });
    }

    currentUA = availableUAs[ getRandomInt(0, availableUAs.length) ];
}

// Defines the available UAs to be used by the extension based on the user's preferences
function setAvailableUAs() {

    availableUAs = [];
    intermediateOSUAs = [];
    intermediateBrowserUAs = [];

    browser.storage.local.get().then((res) => {

        /*defaultUAs.forEach( function (item, index) {
            console.log(item.browser.name);
        });*/

        excludeOSes(res[skeyOSLinux], res[skeyOSMac], res[skeyOSWin]);

        excludeBrowsers(res[skeyBrowserFF], res[skeyBrowserChr], res[skeyBrowserChrmium],
            res[skeyBrowserSaf], res[skeyBrowserOp], res[skeyBrowserEdg],
            res[skeyBrowserIE]);

        /*intermediateBrowserUAs.forEach( function (item, index) {
            availableUAs.push(item.ua); 
        });*/

        getNewUA();

    }, (err) => {

        addAllDefaults(availableUAs);
        getNewUA();
        onError(err);

    });
}

// Excludes OS's not selected by the user
function excludeOSes(includeLinux, includeMac, includeWin) {

    var defaultToInterOS = function() {
        intermediateOSUAs = [];
        defaultUAs.forEach( function (item) {
            intermediateOSUAs.push(item);
        });
    }

    if ( includeLinux && includeMac && includeWin ) {
        defaultToInterOS();
    } else if ( !includeLinux && !includeMac && !includeWin ) {
        defaultToInterOS();
    } else {
        defaultUAs.forEach( function (item, index) {
            if ( includeMac && item.os.name === macUAString ) {
                intermediateOSUAs.push(item);
            }
            if ( includeWin && item.os.name === winUAString ) {
                intermediateOSUAs.push(item);
            }
            if ( includeLinux && (item.os.name === linUAString
                || item.os.name === ubuUAString
                || item.os.name === fedUAString) ) {
                intermediateOSUAs.push(item);
            }
        });
    }
}

// Excludes all browsers that are not the same as the User's
function excludeBrowsers(includeFF, includeChr, includeChrmium,
                        includeSaf, includeOp, includeEdg, includeIE) {

    var interOStoInterBrowser = function() {
        availableUAs = [];
        intermediateOSUAs.forEach( function (item) {
            availableUAs.push(item.ua);
        });
    }

    if ( includeFF && includeChr && includeChrmium && 
        includeSaf && includeOp && includeEdg && includeIE) {

        interOStoInterBrowser();

    } else if ( !includeFF && !includeChr && !includeChrmium && 
        !includeSaf && !includeOp && !includeEdg && !includeIE) {

        interOStoInterBrowser();

    } else {
        intermediateOSUAs.forEach( function (item, index) {
            
            if ( includeFF && item.browser.name === ffUAString ) {
                availableUAs.push(item.ua);
            }
            if ( includeChr && item.browser.name === chromeUAString ) {
                availableUAs.push(item.ua);
            }
            if ( includeChrmium && item.browser.name === chrmiumUAString ) {
                availableUAs.push(item.ua);
            }
            if ( includeSaf && item.browser.name === safUAString ) {
                availableUAs.push(item.ua);
            }
            if ( includeOp && item.browser.name === oprUAString ) {
                availableUAs.push(item.ua);
            }
            if ( includeEdg && item.browser.name === edgeUAString ) {
                availableUAs.push(item.ua);
            }
            if ( includeIE && item.browser.name === ieUAString ) {
                availableUAs.push(item.ua);
            }
        });
    }
}

//The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
