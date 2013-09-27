//cmd+alt+q to line wrap in sublime

var express = require('express');
var http = require('http');
var weblinking = require('web-linking');
var httpheaderlinking = linking.httpheader;


var app = module.exports = express();

app.set('views', __dirname);
app.set('view engine','jade');

//Utiltity functions
/*
{
name: value pairs
link: {rel: href}
}
*/

var crypto    = require('crypto');

function sha1_hmac_digest(key, text){
	var hmac = crypto.createHmac('sha1', key);
	hmac.setEncoding('hex');
	hmac.write(text);
	hmac.end();
	return hmac.read(); 
}


/* SECTION 7 - Content Distribution
https://pubsubhubbub.googlecode.com/git/pubsubhubbub-core-0.4.html#contentdistribution

A content distribution request is an HTTP [RFC2616] POST request from hub to
the subscriber's callback URL with the payload of the notification. This
request MUST have a Content-Type corresponding to the type of the topic. The
hub MAY reduce the payload to a diff between two consecutive versions if its
format allows it.

The request MUST include a Link Header [RFC5988] with rel=hub pointing to the
Hub as well as a Link Header [RFC5988] with rel=self set to the topic that's
being updated. The Hub SHOULD combine both headers into a single Link Header
[RFC5988].

The successful response from the subscriber's callback URL MUST be an HTTP
[RFC2616] success (2xx) code. The hub MUST consider all other subscriber
response codes as failures; that means subscribers MUST NOT use HTTP redirects
for moving subscriptions. The response body from the subscriber MUST be
ignored by the hub. Hubs SHOULD retry notifications repeatedly until
successful (up to some reasonable maximum over a reasonable time period).
Subscribers SHOULD respond to notifications as quickly as possible; their
success response code SHOULD only indicate receipt of the message, not
acknowledgment that it was successfully processed by the subscriber.

*/

/* SECTION 8 - Authenticated Content Distribution
https://pubsubhubbub.googlecode.com/git/pubsubhubbub-core-0.4.html#authednotify

If the subscriber supplied a value for hub.secret in their subscription
request, the hub MUST generate an HMAC signature of the payload and
include that signature in the request headers of the content distribution
request. The X-Hub-Signature header's value MUST be in the form
sha1=signature where signature is a 40-byte, hexadecimal representation of
a SHA1 signature [RFC3174]. The signature MUST be computed using the HMAC
algorithm [RFC2104] with the request body as the data and the hub.secret
as the key.

When subscribers receive a content distribution request with the X-Hub-
Signature header specified, they SHOULD recompute the SHA1 signature with
the shared secret using the same method as the hub. If the signature does
not match, subscribers MUST still return a 2xx success response to
acknowledge receipt, but locally ignore the message as invalid. Using this
technique along with HTTPS [RFC2818] for subscription requests enables
simple subscribers to receive authenticated notifications from hubs
without the need for subscribers to run an HTTPS [RFC2818] server.

Please note however that this signature only ensures that the payload was
not forged. Since the notification also includes headers, these should not
be considered as safe by the subscriber, unless of course the subscriber
uses HTTPS [RFC2818] callbacks.

*/

function sendContentDistribution(content){
	var content_type = 'TBC';
	var key          = 'TBC';
	var self         = 'TBC';
	var hub          = 'TBC';
	var desination   = 'http://...';

	var links = [
     {rel: 'self', href: 'http://example.com/topicurl'},
     {rel: 'hub',  href: 'http://example.com/huburl'}
    ];

    var link_str = httpheaderlinking.stringify(links);

    var signature_str = sha1_hmac_digest(key, content);

	var options = {
	  host: 'localhost',
	  port: '3000',
	  method: 'POST',
	  path: '/relay/distribute/xaxaa',
	  headers: {
	  	'Content-Type': content_type,
	  	'Link': link_str,	  	
	  	'X-Hub-Signature': signature_str
	  }
	};

	callback = function(response) {
	  var str = '';

	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', function (chunk) {
	    str += chunk;
	  });

	  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
	    console.log(str);
	  });
	};

	var req = http.request(options, callback);
	req.write("hello world!");
	req.end();

}

//e.g. curl http://localhost:3000/relay/distribute/adafdasf --data "a=b|" -H "Content-Type: applicatin/json"
app.post('/distribute/:callback', receiveContentDistribution)

function receiveContentDistribution(req, res){
	var callback = req.params.callback;
	var content_type = req.get('Content-Type');
    var link         = req.get('Link');
	var signature    = req.get('X-Hub-Signature');


	//res.set('Content-Type', 'text');
	res.status(200);
	res.send(
	{"received":{
		"link" : link,
		"content_type" : content_type,
		"callback" : callback
		}
	});
};

app.get('/hello', function(req, res){
	console.log("A");
	res.render('hello');
});

console.log("done");