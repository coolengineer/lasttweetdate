var opts = {
	hide30: false
}

chrome.runtime.onMessage.addListener( function(reqs, sender, callback) {
	for( k in reqs ) {
		opts[k] = reqs[k];
	}
	callback( opts );
} );
