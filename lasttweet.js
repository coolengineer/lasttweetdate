
function convert_from_str(datestr)
{
	var a = datestr.split(/[ :]/);
	var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	//console.log( a[6], month.indexOf(a[5]), a[4], (a[0]/1) + 12*(a[2] == 'PM' ? 1:0), a[1], 0 );
	var hour = (a[0]/1) % 12;
	hour += 12*(a[2] == 'PM' ? 1:0);
	return new Date( a[6], month.indexOf(a[5]), a[4], hour, a[1], 0 );
}

var opts = {};

function getopts() {
	chrome.runtime.sendMessage( {}, function(resp) {
		if( !resp ) {
			return;
		}
		for( k in resp ) {
			opts[k] = resp[k];
		}
	} );
	$(".too-old").each( function(idx, el) {
		var x = el.closest("LI");
		$(x).hide();
	} );
}

function blessme() {
	var usernames = $("span.js-action-profile-name,span.js-username,span.u-linkComplex-target");
	var candidates = [];
	var checked = {};
	var check_class = "-lasttweet-checked";
	//var too_old = 30*3; //3 months
	var hide_old = 4; //4 days
	var too_old = 30*3; //3 months
	var now_alive = 3; //3 days
	usernames.each( function(e) {
		var sname = this.innerHTML.replace("@","");
		if( !sname.match(/^[a-z0-9A-Z_]+$/) ) {
			return;
		}
		if( $(this).hasClass(check_class) ) {
			return;
		}
		$(this).addClass(check_class);

		if( checked[sname] ) {
			return;
		}
		checked[sname] = true;
		var el = $(this);
		el.sname = sname;
		candidates.push( el );
	} );
	var now = new Date();
	candidates.forEach( function( el ) {
		//console.log(el);
		$.ajax( {
			url: "/intent/user?lang=en&screen_name=" + el.sname,
			complete: function(data) {
				var tree = $(data.responseText).children();
				var lasttweet = tree.find( "a.tweet-timestamp").first();
				var description = $("<span>");
				if( lasttweet.length == 0 ) {
					description.append( $("<strong>-</strong>") );
				} else {
					var lasttweetdate_str = lasttweet.attr("title");
					var emphasis = "";
					var hide = false;
					if( lasttweetdate_str ) {
						lasttweetdate = convert_from_str(lasttweetdate_str);
						var diff = Math.floor((now - lasttweetdate) / (24*3600*1000) );
						if( diff > too_old ) {
							emphasis = 'style="color:red"';
						}
						if( diff < now_alive ) {
							emphasis = 'style="color:blue"';
						}
						if( diff > hide_old ) {
							el.addClass("too-old");
						}
						if( diff < 0 ) {
							console.log(lasttweet, lasttweetdate, lasttweetdate_str, now - lasttweetdate);
						}
						diff += 'd';
					}
					description.append( $("<strong "+emphasis+">").append(diff) );
					if( hide ) {
						description.parents("li").hide();
					}

				}
				//console.log(description);
				var stats = tree.find( "dd.count a");
				stats.each( function(i) {
					description.append( $("<b> / </b>") );
					description.append( this );
				} );
				description = $("<div>").append(description);
				description.insertBefore( el.parent().parent() );
			}
		});
	} );
};

setInterval( getopts, 3000 );
setInterval( blessme, 3000 );
