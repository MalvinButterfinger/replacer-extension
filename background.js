var replace = [["Die", "DIE HURENSÖHNE"]];

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
            sendResponse(replace);
    });

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

});

chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, replace);
    });
});
