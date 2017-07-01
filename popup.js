var hide30 = document.getElementById("hide30");
hide30.addEventListener("click", function() {
	chrome.runtime.sendMessage( { hide30: $("#hide30").prop("checked") }, function(resp) {
	} );
});

chrome.runtime.sendMessage( {}, function(resp) {
	$("#hide30").prop("checked", resp.hide30 );
} );
