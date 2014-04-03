function blessme() {
	var usernames = $("span.js-action-profile-name,span.js-username");
	var candidates = [];
	usernames.each( function(e) {
		var sname = this.innerHTML.replace("@","");
		if( !sname.match(/^[a-z0-9A-Z_]+$/) ) {
			return;
		}
		var el = $(this);
		if( el.sname ) return;
		el.sname = sname;
		candidates.push( el );
	} );
	candidates.forEach(	function( e ) {
		//console.log( e );
		var el = e;
		$.getJSON( "/i/profiles/popup?async_social_proof=true&screen_name=" + e.sname,
			function(data) {
				el.append( " <br/> " );
				var tree = $(data.html).children();
				var description = $("<b>");
				description.append( tree.find( "span.js-short-timestamp").first());
				var stats = tree.find( "strong.js-mini-profile-stat");
				stats.each( function(i) {
					description.append( $("<b> / </b>") );
					description.append( this );
				} );
				el.append( description );
			}
		);
	} );
};

setInterval( blessme, 3000 );
