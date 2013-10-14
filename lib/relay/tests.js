var relay = require('relay');

var defaults = {};

var myrelay = relay.Relay(defaults);

//publishers can be local, clustered or remote.

//Local. Topics in this publisher only belong to this local instance.
var mypublisher = myrelay.createLocalPublisher();

//clusterd. Topics in this publisher are shared across a cluser.
/*
e.g. is you create a topic in this local instance, every other 
instance in the cluster will have access to that topic.
*/
var mypublisher = myrelay.createClusterPublisher(name);

//remote
var mypublisher = myrelay.createRemotePublisher(baseurl);



//publishers can be local or clustered.
var mysubscriber = myrelay.createLocalSubscriber();

var mysubscriber = myrelay.createClusterSubscriber(name);


mypublisher.createTopic("testtopic");


mysubscriber.createSubscription(mypublisher, "testtopic", function(err, data){

});


mypublisher.push("testtopic",
  {
    message:"I'm up and running" & someuniquestring
  }
);


//CODE run this on many nodes in a cluster, each node is talking to itself.
//1:1
localPublisher.push("topic", entry);

localSubscriber.subscriber(localPublisher, "topic" function(err, entry){});

//CODE run this on many nodes in a cluster, 
//the local subscribers on each node and listenting to a co-ordinated cluser of publishers
//when one publisher node pushes all subscriber nodes get notfied.
cluseterPublisher.push("topic", data);

localSubscriber.subscriber(cluseterPublisher, "topic" function(err, data){});

//CODE run this on many nodes in a cluster, 
//the local subscribers on each node and listenting to a co-ordinated cluser of publishers
//when one publisher node pushes one subscriber nodes get notfied.
cluseterPublisher.push("topic", data);

cluseterSubscriber.subscriber(cluseterPublisher, "topic" function(err, data){});



//PUBLISHER API


//-------- TOPICS --------

//CREATE topic
app.post   ("/topics",functon(req,res){
  var topic = relay.topics.create(req.data);
  render(topic);
});

//READ MANY topics
app.get    ("/topics",functon(req,res){
  var tlist = relay.topics.all();
  render(tlist);
});

//READ 1 topic
app.get    ("/topics/:name",functon(req,res){
  var topic = relay.topics.read(req.name);
  render(topic);
});

//UPDATE
app.put    ("/topics/:name",functon(req,res){
  var topic = relay.topics.update(req.name, req.data);
  render(topic)
});

//DELETE
app.delete ("/topics/:name",functon(req,res){
  var result = relay.topics.delete(req.name);
  render(result);
});



//-------- ENTRIES --------

//CREATE entry
app.post   ("/topics/:name/entries",functon(req,res){
  var topic = relay.topics.read(req.name);
  var entry = topic.entries.create(req.data);
  render(entry);
});

//READ MANY entries
app.get    ("/topics/:name/entries",functon(req,res){
  var topic = relay.topics.read(req.name);
  var elist = topic.entries.all();
  render(elist);
});

//READ 1 entry
app.get    ("/topics/:name/entries/:id",functon(req,res){
  var topic = relay.topics.read(req.name);
  var entry = topic.entries.read(req.id);
  render(entry);
});

//UPDATE
app.put    ("/topics/:name/entries/:id",functon(req,res){
  var topic = relay.topics.read(req.name);
  var entry = topic.entries.update(req.name, req.data);
  render(entry)
});

//DELETE
app.delete ("/topics/:name/entries/:id",functon(req,res){
  var topic  = relay.topics.read(req.name);
  var result = topic.entries.delete(req.name);
  render(result);
});


//HUB API 

/*
    * 5.1. Subscription Request 
    * 5.2. Subscription Validation 
    * 5.3. Subscriber Verification 
    * 5.4. Subscription Renewall
    * 5.5. Subscription Denial 
*/

//5.1 The Subscriber sends a Subscription Request to a Publisher
//5.2 The Hub validates the Subscription Request
//POST <advertised_hub_url>
app.post ("/hub",functon(req,res){
  var subrequest;
  try{
    var subrequest = parse_and_validate_subrequest(req);
  }catch(e){
    //400 Bad Request
    return;
  }
  verificationqueue.push(subrequest);
  render(result);
});


//queue function
//5.3. Subscriber Verification 
verificationqueue.on("new", function(subrequest){
  //get callback
  //if 
    //create the subscription
    hub.callback //subscriber_callback_url
    hub.mode //subscribe
    hub.topic //advertised_topic_url
    hub.lease_seconds //lease_seconds
    hub.secret //secret
    var topic = relay.topics.create(subrequest.hub.topic); //a remote topic

  //else
    //
});

//will be fired within the current node worker. However it's possible the current worker
//is note configured for redistributing the content so ush to the queue to allow another 
//potentially more suitable node worker to pick it up.
relay.topics.on("new-entry", function(changeevent){
  distributionqueue.push(changeevent);
})


//queue function
//new content to distribute out. create a task for each subscription.
distributionqueue.on("new", function(changeevent){
  //for each subscription
  subscriptioncallbackqueue.push(changeevent + subscription);
});

//queue function
//new content to distribute out. create a task for each subscription.
subscriptioncallbackqueue.on("new", function(changeevent){
  //POST
});