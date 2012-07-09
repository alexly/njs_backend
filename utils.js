if (!Function.prototype.Bind) { // check if native implementation available
  Function.prototype.Bind = function() { 
	var fn = this, args = Array.prototype.slice.call(arguments),
	object = args.shift(); 
	return function() { 
		return fn.apply(object, args.concat(Array.prototype.slice.call(arguments))); 
	}; 
  };
}

exports.ParseCookies = function(_cookies) {
    var cookies = {};

    _cookies && _cookies.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });

    return cookies;
}

