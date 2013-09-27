Relay
=====

_Publish and subscribe to anything._

    ------->
    P      S 
    <-------  


Relay for Java
==============

This is the node.js implementation of Relay.



This is a Relay server implenntation for Node.js. For more about Relay see https://github.com/aogriffiths/relay.

{
      "contents": "\n\nAPI\n===\n\nfeedA = relayServer.get('feedaname');\n\nfeedA.tail().get(function(items){\n  //items returns the default lis of most recent items\n});\n\nthousand_most_recent_items = feedA.tail(1000).get(function(items){\n  //items returns a chunk of recent items  \n});\n\n\n\n\n\nData Model\n==========\n\nLogically\n\nRelayStore  1-*  Feed[s]\nFeed        1-*  FeedItem[s]\n\nThat's it!\n\nRelay makes the physical storage abstract with methods like:\n\nGet an interator on a feed with:\n\n    feed = relayStore.get('feedName')\n\n    itterator = feed.latest(); //get the latest items (a list of the default length)\n \n\nThen either:\n\n    while(itterator.hasNext()){\n      itterator.getNext(function(err, item){\n\n      })\n    }\n\n\nOr:\n\n    itterator.getWhileTrue(function(err, item){\n        \n      return true;\n    })\n\n\nThere are four ways in total to get a interator on the feed:\n\n    itterator = feed.latest();     //get the latest items (a list of the default length)\n    itterator = feed.latest(1000); //get the latest 1000 items \n    itterator = feed.latestMax();  //get as many items as possible - be carefull what you ask for!\n    itterator = feed.since(etag);  //get all items since etag.\n\nAll itterators go back in time.\n\n\nAt a lower level:\n\nIterating back in chunks:\n\n    chunk = feed.latestChunk();   \n    while(chunk){\n      items = chunk.items();\n      chunk = chunk.previousChunk();\n    }\n\nIterating forwards in chunks:\n\n    chunk = feed.earliestChunk();   \n    while(chunk){\n      items = chunk.items();\n      chunk = chunk.nextChunk();\n    }\n\n\nSeak to a specific chunk and get a range from there. e.g. from chunk 678 to 688\n\n    id = 678;\n    chunk = feed.getChunk(id);   \n    while(chunk.id < id + 10){\n      items = chunk.items();\n      chunk = chunk.nextChunk();\n    }\n\n\n\n\nfeed.chunk();   //return the most recent chunk\n\nfeed.chunk(1);  //return a chunk by id\n\nRelayStore.history(chunkid, function(err, partlist){...});\n\n\nMedium Level\n============\n    feed = relay.feed('name');\n\nRead \n----\n    entryGetter =            //either:\n    feed.recent();           // or:\n    feed.recent(1);          //(null, 1   ) or:\n    feed.recent(20);         //(null, 20  ) or:\n    feed.since(e);           //(null, e   ) or:\n    feed.before(e);          //(e   , null) or:\n    feed.beforeSince(e1,e2); //or:\n\nWHERE e is either a date or an eTag.\n\nThen:\n\n    entryGetter.each(function(err, entry){\n      \n    });\n\nGives:\n\n                          e        e1                e2\n    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]\n                                                  *****************   .recent()   or .beforeSince(null, null)\n                                                                 **   .recent(1)  or .beforeSince(null, 1   )\n           ********************************************************   .recent(20) or .beforeSince(null, 20  )\n                             **************************************   .since(e)   or .beforeSince(null, e   )\n     *********************                                            .before(e)  or .beforeSince(e   , null)  \n                                      **************                                 .beforeSince(e1  , e2  )  \n    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]\n                          e        e1                e2\n\n\nNOTES\n* entryGetter is a sorted array of entries, in the order they were pushed to the feed.\n* WARNING entryList MAY NOT contain all the entries you request. To ensure performance it may \nreturn a partial list and a reference to retrive the next part. For example if you call \n`feed.since(0)` you are effectively asking for all entries since the begining of time.\n\nAll feed.getter functions are convience wrappers of feed.beforeSince(e1, e2)  \n\nUnder the bonnet\nfeed.beforeSince(null, e2)  \n\nalways results in \n\nGET /feed\nETag: e2\n\n\n\n\n\nLowest Level\n============\n\n1. Read and write entries\n\n    feedStore = relayStore.feedStore('name');\n\n    //READ\n    var entry =              //either:\n    feedStore.firstEntry();  //or:\n    feedStore.entry('id');\n\n    //WRITE \n    feedStore.pushEntry(entry);\n\nNOTES\n* All entries are added to the first possition in the feed (hence the method being called \"push\").\n* If an entry with the same id is already in the feed it will be moved from it's current possition to the first possition and then it's value (and optionally metadata) will be overwritten with the new value.\n* If an entry is intended to be pushed it's updated date SHOULD be more recent that the current first entrie's updated date. The behavious if not is not guranteed by this spec.\n\n2. Entry data\n\n    entry.id;\n    entry.updated; \n    entry.metadata;\n    entry.value;\n\n3. Linked list\n\n    entry.nextEntry();\n    entry.prevEntry();\n\n4. Pub Sub\n\n    feedStore.subscribe(callback)\n\nNOTES\n* callback is called when new entries are added\n\n",
      "file": "README.md",
      "file_size": 0,
      "file_write_time": 1380131556000000,
      "settings":
      {
        "buffer_size": 4847,
        "line_ending": "Unix"
      }
    }