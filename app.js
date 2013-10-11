
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var relay = require('./lib/relay');


var app = express();
var realyApp = relay.createApp();

var defaults = {
  "store":"memmory",
  "ContentType":"application/json"
}


var publisher = relay.createPublihser(defaults);

app.use(express.logger('dev'));
app.use('/relay', relayApp);

publisher.createTopic("mytopic");

publisher.pushEntry({"name":"newentry"});

//partern one
//app.use(expressapp);

//partern two
//app.all('/hello', relayApp);

/*
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
*/

app.listen('3000');
console.log("Express server listening on port " + app.get('port'));