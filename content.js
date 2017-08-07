// https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom

var replace = [];

chrome.runtime.sendMessage({}, function(response) {
    replace = response;
});

var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe foo for changes in children
            if (obj)
                obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    };
})();

function replaceTextOnPage(from, to){
    getAllTextNodes().forEach(function(node){
        node.nodeValue = node.nodeValue.replace(new RegExp(quote(from), 'g'), to);
    });

    function getAllTextNodes(){
        var result = [];

        (function scanSubTree(node){
            if(node.childNodes.length)
                for(var i = 0; i < node.childNodes.length; i++)
                    scanSubTree(node.childNodes[i]);
            else if(node.nodeType == Node.TEXT_NODE)
                result.push(node);
        })(document);

        return result;
    }

    function quote(str){
        return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    }
}

function replaceAll() {
    for(var i=0;i<replace.length;i++) {
        replaceTextOnPage(replace[i][0], replace[i][1]);
    }
}

window.addEventListener('load', function() {
    replaceAll();
});


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        replace = request;
        replaceAll();
    });