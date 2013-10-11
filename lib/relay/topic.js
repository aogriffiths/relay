//cmd+alt+q to line wrap in sublime

var express           = require('express');
var http              = require('http');
var weblinking        = require('web-linking');
var httpheaderlinking = linking.httpheader;

var events            = require('events');
var util              = require('util');



var Topic = module.exports.Topic = function(options){
  events.EventEmitter.call(this);
  this.name = options.name;
  this.store = options.store; //somthing that acts like a linked list;
  this.windowlength = options.windowlength;
};

util.inherits(Topic, events.EventEmitter);


Publisher.prototype.push = function(entry){
  this.store.push(entry);
  this.emit("newentry", entry); 
}

Publisher.prototype.subscribe = function(callback){  
  //TODO Make this work for a multi node server. Needs redis or similar to ensure every node dosn't 
  //get callback for the same event.
  this.on("newentry", function(data){
    callback(null, data);
  });
}

Publisher.prototype.get = function(){
  return this.store.get(this.windowlength);
}
