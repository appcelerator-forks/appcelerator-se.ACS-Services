/**
 * Access this service using the following URL
 * 
 * http://7ebb29e9b883952dc59c6c60ec80801fc72db609.cloudservices.appcelerator.com/url
 * 
 * @param longUrl :: URL to shorten
 * 
 * METHOD = GIT or POST works, If you use POST, ensure that your passing an stringified object
 * 
 * Ex. {"longUrl":"http://www.myreallylongurl.com"}
 */




/**
 * service definition file
 */
nettle_logger.setLevel('DEBUG');
var https = require('https');

api.url = function(req, res) {
	
	var data;
	
	switch(req.method) {
		
		case "POST":
			data = req.body;
		break;
		case "GET":
		default:
			data = req.query
	}
	
	
	if(data.longUrl) {
		nettle_logger.info('Attempting to call Google ShortURL API');
		
		GoogleAPI_shortenUrl(data.longUrl, function(response) {
			
			//nettle_logger.debug("\n\nSTATUS: "+response.statusCode);
			//nettle_logger.debug("\nHEADERS: "+ JSON.stringify(response.headers));
			
			response.on('data', function(data){
				//nettle_logger.debug("\n\nDATA: "+data);
				res.write(data);
				res.end();
			});
		
		});
	}
	else {
		var err = {};
		err.message = "NO DATA";
		err.no = "400"
		//nettle_logger.debug(JSON.stringify(err));
		res.write(JSON.stringify(err));
		res.end();
	}
	
};

var GoogleAPI_shortenUrl = function(url, callback) {
	
	var postData = JSON.stringify({longUrl:url});
	
	var o = {};
	o.hostname = 'www.googleapis.com';
	o.path = '/urlshortener/v1/url';
	o.method = 'POST';
	o.headers = {
		"Content-Type": 'application/json',
	};
	
	//nettle_logger.info('URL: ' + url);

	var myreq = https.request(o, callback);
	myreq.on('error', function(e){
		nettle_logger.debug('ERR: '+e.message);
	});
	
	//myreq.setEncoding('utf8');
 	
 	//nettle_logger.debug('\nPOST_DATA: '+postData);
 	myreq.write(postData);
 	myreq.end();
 	
}

// service life cycle event is called when the service is started
lifecycle.start = function(ready) {
	nettle_logger.debug('Started service ' + __name);
	ready();
};

// service life cycle event is called when the service is stopped
lifecycle.stop = function() {
	nettle_logger.debug('Stopped service ' + __name);
};
