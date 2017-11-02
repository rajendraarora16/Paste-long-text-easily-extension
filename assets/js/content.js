/**
 * @author: Rajendra Arora
 * @date: 28 Oct 2017
 */


var element;

document.addEventListener("contextmenu", function(e){
	element = e.target;
});

var textAcceptingInputTypes = [
	"text",
	"url",
	"search",
	"textarea",
	"textbox",
	"div"
];

var forbiddenTextAcceptingInputTypes = [
	"number",
	"range",
	"date",
	"month",
	"week",
	"time",
	"datetime"
];
function getCaretPosition(field){
	var caretPos = 0;

	if($.inArray(field.type, textAcceptingInputTypes) > -1){
		caretPos = field.selectionStart;
	}
	else if('selectionStart' in field && $.inArray(field.type, forbiddenTextAcceptingInputTypes) == -1){
		caretPos = field.selectionStart;
	}
	else if(document.selection){
		field.focus();

		var sel = document.selection.createRange();
		sel.moveStart('character', -field.value.length);
		caretPos = sel.text.length;
	}
	return caretPos;
}


$(document).on('ready', function(){

	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
		if(message.status == "success" && message.type == "string"){
			var caretPos = getCaretPosition(element),
				initialValue = element.value,
				firstPart = initialValue.substr(0,caretPos),
				selectedText = initialValue.substring(element.selectionStart, element.selectionEnd),
				lastPart;

			// This makes sure the selected text is removed while pasting the link
			if (selectedText != '') {
				lastPart = initialValue.substr(caretPos + selectedText.length);
			} else {
				lastPart = initialValue.substr(caretPos);
			}

			element.value = firstPart + message.link + lastPart;
		}
	});

	chrome.runtime.sendMessage({ method: "getLocalStorage", key: "status" }, function(response) {
		for (var key in response.data) {
			$('input').each(function(index, data) {
				if (data.type != 'hidden' && $.inArray(data.type, forbiddenTextAcceptingInputTypes) == -1) {
					if (data.name.toUpperCase().search(key.toUpperCase()) != -1) {
						$(`[name="${data.name}"]`).val(response.data[key]);
					}
					else if(data.id.toUpperCase().search(key.toUpperCase()) != -1) {
						$(`[id="${data.id}"]`).val(response.data[key]);
					}
				}
			});
		}
	});

});
