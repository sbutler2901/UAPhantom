// This file stores all global variables shared amongst background pages

'use strict';

//********************* Global variables *********************

// Is Addon Enabled
var isDisabled;

// Major UA Variables
var currentUA;
var defaultUAs = [];
var availableUAs = [];
const minAvailableUAs = 5;

// Addon Default Settings
var defaultIsDisabled = false;
var defaultShouldChange = true;
var defaultChangeFreq = 30;
var defaultOS = true;
var defaultBrowser = true;
var changeFreqTimeMin = 1;
var changeFreqTimeMax = 60;

// Icon File Paths
const baEnabledIconPath = "icons/PhantomGreen-96.png";
const baDisabledIconPath = "icons/PhantomRed-96.png";

// Browser Local Storage Keys
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

//TODO: implement storage for chromium
var skeyBrowserChrium = "browser_filter_chromium";

// User Agent OS Strings
var macUAString = "Mac OS";
var winUAString = "Windows";
var linUAString = "Linux";
var ubuUAString = "Ubuntu";
var fedUAString = "Fedora";

// User Agent Browser Strings
var ffUAString = "Firefox";
var chrmiumUAString = "Chromium";
var chromeUAString = "Chrome";
var safUAString = "Safari";
var ieUAString = "IE";
var edgeUAString = "Edge";
var oprUAString = "Opera";
