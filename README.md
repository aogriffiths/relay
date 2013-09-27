Relay for Node.js
=================

_Publish and subscribe to anything._

    ------->
    P      S 
    <-------  



API
===

feedA = relayServer.get('feedaname');

feedA.tail().get(function(items){
  //items returns the default lis of most recent items
});

thousand_most_recent_items = feedA.tail(1000).get(function(items){
  //items returns a chunk of recent items  
});





Data Model
==========

Logically

RelayStore  1-*  Feed[s]
Feed        1-*  FeedItem[s]

That's it!

Relay makes the physical storage abstract with methods like:

Get an interator on a feed with:

    feed = relayStore.get('feedName')

    itterator = feed.latest(); //get the latest items (a list of the default length)
 

Then either:

    while(itterator.hasNext()){
      itterator.getNext(function(err, item){

      })
    }


Or:

    itterator.getWhileTrue(function(err, item){
        
      return true;
    })


There are four ways in total to get a interator on the feed:

    itterator = feed.latest();     //get the latest items (a list of the default length)
    itterator = feed.latest(1000); //get the latest 1000 items 
    itterator = feed.latestMax();  //get as many items as possible - be carefull what you ask for!
    itterator = feed.since(etag);  //get all items since etag.

All itterators go back in time.


At a lower level:

Iterating back in chunks:

    chunk = feed.latestChunk();   
    while(chunk){
      items = chunk.items();
      chunk = chunk.previousChunk();
    }

Iterating forwards in chunks:

    chunk = feed.earliestChunk();   
    while(chunk){
      items = chunk.items();
      chunk = chunk.nextChunk();
    }


Seak to a specific chunk and get a range from there. e.g. from chunk 678 to 688

    id = 678;
    chunk = feed.getChunk(id);   
    while(chunk.id < id + 10){
      items = chunk.items();
      chunk = chunk.nextChunk();
    }




feed.chunk();   //return the most recent chunk

feed.chunk(1);  //return a chunk by id

RelayStore.history(chunkid, function(err, partlist){...});


Medium Level
============
    feed = relay.feed('name');

Read 
----
    entryGetter =            //either:
    feed.recent();           // or:
    feed.recent(1);          //(null, 1   ) or:
    feed.recent(20);         //(null, 20  ) or:
    feed.since(e);           //(null, e   ) or:
    feed.before(e);          //(e   , null) or:
    feed.beforeSince(e1,e2); //or:

WHERE e is either a date or an eTag.

Then:

    entryGetter.each(function(err, entry){
      
    });

Gives:

                          e        e1                e2
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
                                                  *****************   .recent()   or .beforeSince(null, null)
                                                                 **   .recent(1)  or .beforeSince(null, 1   )
           ********************************************************   .recent(20) or .beforeSince(null, 20  )
                             **************************************   .since(e)   or .beforeSince(null, e   )
     *********************                                            .before(e)  or .beforeSince(e   , null)  
                                      **************                                 .beforeSince(e1  , e2  )  
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
                          e        e1                e2


NOTES
* entryGetter is a sorted array of entries, in the order they were pushed to the feed.
* WARNING entryList MAY NOT contain all the entries you request. To ensure performance it may 
return a partial list and a reference to retrive the next part. For example if you call 
`feed.since(0)` you are effectively asking for all entries since the begining of time.

All feed.getter functions are convience wrappers of feed.beforeSince(e1, e2)  

Under the bonnet
feed.beforeSince(null, e2)  

always results in 

GET /feed
ETag: e2





Lowest Level
============

1. Read and write entries

    feedStore = relayStore.feedStore('name');

    //READ
    var entry =              //either:
    feedStore.firstEntry();  //or:
    feedStore.entry('id');

    //WRITE 
    feedStore.pushEntry(entry);

NOTES
* All entries are added to the first possition in the feed (hence the method being called "push").
* If an entry with the same id is already in the feed it will be moved from it's current possition to the first possition and then it's value (and optionally metadata) will be overwritten with the new value.
* If an entry is intended to be pushed it's updated date SHOULD be more recent that the current first entrie's updated date. The behavious if not is not guranteed by this spec.

2. Entry data

    entry.id;
    entry.updated; 
    entry.metadata;
    entry.value;

3. Linked list

    entry.nextEntry();
    entry.prevEntry();

4. Pub Sub

    feedStore.subscribe(callback)

NOTES
* callback is called when new entries are added

