//cmd+alt+q to line wrap in sublime

var express           = require('express');
var http              = require('http');

var weblinking        = require('web-linking');
var httpheaderlinking = weblinking.httpheader;

var events            = require('events');
var util              = require('util');

var publisher         = require('publisher');
var Publisher         = publisher.Publisher;




var Relay = module.exports.Relay = function(defaults){
  events.EventEmitter.call(this);
  this.publishers = {};
  this.subscribers = {};
}

util.inherits(Relay, events.EventEmitter);


Relay.prototype.createPublihser = function(options){
  //TODO merge options and defaults;
  var opts;
  opts.relay = this;
  if(! opts.name) 
    throw new Error("Options must include a name for this publisher");
  if(this.publishers[opts.name]) 
    throw new Error("A publisher of this name already exists");
  var newpublisher = new Publisher(opts); 
  this.publishers[opts.name] = newpublisher;
  return newpublisher;
}


Relay.prototype.createApp = function(){
  var relay = this;

  var app = express();

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

  app.get('/topic/:topicname', function(req, res){
    var topicname //TODO
    body = relay.pubsishers[topicname].getTopic();
    headers["ContentType"]
    hub.url
  });
}

console.log("done");