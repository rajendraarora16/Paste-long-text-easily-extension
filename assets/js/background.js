/**
 * @author: Rajendra Arora
 * @date: 28 Oct 2017
 */


var longText = chrome.contextMenus.create({
	"title": "Paste easy long text",
	"contexts": ["editable"],
	"onclick": pasteLink
});

function pasteLink(info, tab){

	var requested_key, requested_link, status;

	if(info.menuItemId == longText){
		requested_key = "longText";
	}

	//Functional Logic
	chrome.tabs.query({
		"active": true,
		"currentWindow": true
	}, function (tabs) {
		requested_link = localStorage.getItem(requested_key);
		status = "success";
		if(typeof requested_link == "object" || requested_link == ""){
			status = "fail";
		}

		// send message to the current tab
		chrome.tabs.sendMessage(tabs[0].id, {
			status: status,
			link: requested_link,
			type: typeof requested_link
		});
	});
}

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	    var allLinks = {};

	    for(var key in localStorage){
	        if(localStorage.hasOwnProperty(key) && localStorage.getItem(key) !== ''){
	            allLinks[key] = localStorage.getItem(key);
	        }
	    }
	    if (request.method == "getLocalStorage")
	        sendResponse({ data: allLinks });
	    else
	        sendResponse({}); 
	});

 
