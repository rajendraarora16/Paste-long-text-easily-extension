/**
 * @author: Rajendra Arora
 * @date: 28 Oct 2017
 */

var list_keys = ['longText'];

// This will show saved long text while clicking on extension
function updateUI(){
	for(var i in list_keys){
		var key = list_keys[i];
		var link = localStorage.getItem(key);
		if(typeof link == "string"){
			document.getElementById(key).value = link;
		}
		else{
			document.getElementById(key).value = "";
		}
	}
}

function animate_text(id){
	var text_div = $(id)
	
	text_div.show();
	text_div.fadeOut(2000);
}

$(document).on('ready', function(){

	$("#save_text").on('click', function(e){
		document.getElementById("save_text").innerHTML = "Saving..";
		for(var i in list_keys){
			var key = list_keys[i];
			var newValue = document.getElementById(key).value;
			localStorage.setItem(key, newValue);
		}
		// trigger to show the saved links
		updateUI();
		animate_text("#success_text");

		document.getElementById("save_text").innerHTML = "Long text stored!";
	});

	$("#remove").on("click", function(){
		localStorage.clear();
		updateUI();

		animate_text("#remove_text")
	});

	// trigger to show the saved links
	updateUI();

});