function ualog(content) {
  console.log("UASpoofer: " + content);
}

function onError(error) {
  ualog('Error: ${error}');
}

function rewriteUserAgentHeader(e) {
  for (var header of e.requestHeaders) {
    if (header.name.toLowerCase() == "user-agent") {
      header.value = defaultUserAgents;
    }
  }
  return {requestHeaders: e.requestHeaders};
}

browser.webRequest.onBeforeSendHeaders.addListener(
  rewriteUserAgentHeader,
  {urls: ["<all_urls>"]},
  ["blocking", "requestHeaders"]
);

function disable() {
  browser.storage.local.set({
    disable: true
  }).catch(onError);
  browser.storage.local.get('disable').then((res) => {
    ualog(res.disable);
  });
}

function getDisabled(callback) {
  browser.storage.local.get("disabled").then((res) => {
    ualog("disabled!!!: " + res.disabled);
    callback(res.disabled);
  });
}

function setNewUA() {
}

const shouldDebug = false;
const defaultUserAgents = "Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16";
