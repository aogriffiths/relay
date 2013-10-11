//cmd+alt+q to line wrap in sublime

var express           = require('express');
var http              = require('http');
var weblinking        = require('web-linking');
var httpheaderlinking = linking.httpheader;

var events            = require('events');
var util              = require('util');

var topic             = require('topic');
var Topic             = topic.Topic;


var Publisher = module.exports.Publisher = function(options){
  events.EventEmitter.call(this);
  this.topics = {};
  this.relay = options.relay;  
};

util.inherits(Publisher, events.EventEmitter);

Publisher.prototype.subscribe = function(topicname, callback){
  this.topics[topicname].subscribe(callback);
}

Publisher.prototype.createTopic = function(topicname, options){
  var newtopic = new Topic(options); 
  this.topics[topicname] = newtopic;
  return newtopic;
}
