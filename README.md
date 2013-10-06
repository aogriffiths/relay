Relay
=====

_Publish. Subscribe. Syndicate._

    ------->
    P      S 
    <-------  



Specification
=============

Status: DRAFT

Author(s): Adam Griffiths


Abstract
--------

This document specifies "Relay", a syndication protocol for publishing and
subscribing to feeds.

Introduction
------------

Relay is inspired by and compatible with PubSubHubbub (PuSH) but has some
additional features that you might find useful. Realy considers any server to
be capable of being a Publisher, a Subscriber, a Hub or all three. What does
this mean? A picture is worth a thousand words:

![Relay_PuSH](Relay_PuSH.png)


In PuSH parlance Relay requires all Publishers are thier own Hubs. It  alows
Publishers and Hubs to push feeds to Subscribers and other Hubs. This means an
architecture almost idential to PuSH can be acived but Realy gives to
advantages.

1. A chain of Hubs can be created. 
2. Publishers push to Hubs using exactly the same protocol as Hubs push to 
   Subscribers.

There are also lots of other goodies in the Realy spec, so read on...


1. Notation and Conventions
---------------------------

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119](http://www.ietf.org/rfc/rfc2119.txt). 


2. Definitions
--------------

If you are familiure with PuSH you should find the following definaitions similar. 

__PuSH:__ When the word "push" is capitalised as "PuSH" it refers to PubSubHubbub, unless otherwise specifided, version 0.4.

__Topic/Feed: __ The words "feed" and "topic" are used intechangably. A Topic is the unit to which one can subscribe to. It is a collection of entries.

__Entry/Item:__ A topic is a collection of entries (Synonymous with a feed being a collection of items).

__Publisher:__ (_noun_). An entity that sends notifications of Changes to a Topic.

__Originating Publisher:__ (_noun_). The Publisher entity that owns a Topic. They are the originating source and the only system that authors changes to the topic.

__To publish:__ (_verb_). The process of notfying subscribers of changes to a Topic. The originating Publisher MUST _publish_ the Topic using the Relay specification. Other systems MAY also re-_publish_ the Topic, in which case they are acting as a Hub.

__Subscriber:__ (_noun_). An entity that receives notifications of changes to a Topic. 

__To subscribe:__ (_verb_). The process of requesing a Publisher publishes to a Subsciber on an on going basis. Usuaully initiated by the subscriber.

__Hub:__ An entity that both subscribers to a Topic and publishes it. A Hub re-publishes a Topic or you could say it relays it.

### IMPORTANT

A Hub is both a Publisher and a Subscriber.

In the following documentation, unless explicitly stated otherwise, anything that is specified for a Subscriber applies equally to a Hub. A Hub is a Subscriber to the Topics that it manages.

Likewise, anything that is specified for a Publisher applies equally to a Hub. A Hub is a Publisher of the Topics that it manages.

3. High-level protocol flow
----------------------------
(This section is non-normative.)

1. __Discovery__ - A Subscriber discovers a Topic from a Publisher and how
to subscribe to it. (_Identical to the PusH spec. See part 4_)

2. __Subscription__ - The Subscriber subscribes to the Topic to receive
notification when it changes. (_Identical to the
PusH spec. See part 3, 2nd bullet_). If the Subscriber is a Hub itself it
SHOULD make this known at the time of subscribtion. (_An extension to the PuSH
spec, see below.)

3. __Publishing__ - Publishers POST any topic changes to their subscriber(s)
(which many be Hubs). (_Compatible with the PusH spec part 3, 1st bullet.
Different to part 3, 3rd bullet, but that's fine as per part 6_)

4. __Relay-Publishing or Content Distribution__ - When Hubs receive POSTed
Topic changes the POST them on to their subscriber(s), which many also be
Hubs, so the chain continues until all Hubs and Subscribers are reached. 
(_Publishing and Relay-Publishing are done in an identical way and follow
the PusH spec part 7_)

5. __Handeling Failiures__ - Publishers SHOULD stop POSTing to Subscribers
after an agreed number of retrys fail. Both Publishers and Subscribers SHOULD
follow the Relay specification for detecting, altering and recovering failed
subscriptions.

6. __Catchup and History__ - Publishers SHOULD support one of two mechansims
to allo Subscribers to catchup or get historical Topic entries. This is usful
for Subscribers after recovering from a failiure or at the point of initial
subscription.


        Thin vs. Fat. Fat pings contain everything required to update the subscriber. Thin pings MAY require a subscriber calls back to the Publisher to get a complete copy of changed topic. Publishers MUST support fat pings and MAY support thin pings. Subscribers MUST suport the types of ping they intend to subscribe to, ideally this would be both to support general robustness.


        * The hub caches minimal metadata (id, data, entry digest) about each topic's previous state. When the hub re-fetches a topic feed (on its own initiative or as a result of a publisher's ping) and finds a delta, it enqueues a notification to all registered subscribers.

        * Realy also supports chaining, such that one Realy Publisher can publish to a chain or network of Realy Hubs which can eventaully pubish to a Realy Subscriber.

4. Discovery
------------
(Identical to the PuSH specification.)
![Relay_Discovery](Relay_Discovery.png)


Subsriber makes a GET or HEAD request to a topic.
    
    HEAD <topic_url> HTTP/1.1
    Host: <hostname.com>

Publisher responds with the latest version of the topic and suitable headers

    HTTP/1.1 200 OK
    Content-Type: text/xml; charset=utf-8
    Content-Length: length
    Link: <hub_link_url>; rel=hub, <self_link_url>; rel=self

1. `<self_link_url>` SHOULD be equal to the `<topic_url>` (This specification 
   does not address the scenario if it is not).

2. There MAY be more than one `<hub_link_url>`. If so Subscribers MAY
   subscriber to one or more Hub. Subscribing to one is RECOMMENDED and
   Subscribers SHOULD use the first first `<hub_link_url>` provided unless
   there is a logical reason not to. Publishes SHOULD put their prefered hub
   earlier in the list of hub_link_url's.

3. It is NOT RECOMENDED that Relay Publishers use any alternative methods of
   discovery mentioned in the PuSH 0.3 and PuSH 0.4 sepcification.

4. Realy Subscribers MAY OPTIONALLY fall back to alternative methods of
   discovery if they are required to support older PuSH Topics.


5. Subscribing and Unsubscribing
--------------------------------
(Identical to the PuSH specification.)


Follows the PuSH specification but adds some extentions. The steps are:

1. __(5.1) Subscription Request__ - The Subscriber sends a Subscription Request to a Publisher
2. __(5.2) Subscription Validation__ - The Publisher validiates the Subscription Request
3. __(5.3) Verification of Subscriber Itent__ - The Publisher verifies the intent of the Subscriber
4. __(6 and 7) Publishing and Content Distribution__ - The Publisher sends all updates to the topic to the Subscriber

Each step request the previous step is succesful and in this process the Subscriber is given 
a number of `lease_seconds` and MUST resubscribe before these have elapsed.


### 5.1. Subscription Request
(Identical to the PuSH specification.)
_The Subscriber sends a Subscription Request to a Publisher_
![Relay_Subscribe](Relay_Subscribe.png)

Subscriber Request:

    POST <subscriber_callback_url> HTTP/1.1
    Content-Type: application/x-www-form-urlencoded
    Content-Type: <topic_content_type>
    Link: <hub_url>; rel=hub, <topic_url>; rel=self

Publisher Response (sucess):

    HTTP/1.1 200 OK


### 5.2. Subscription Validation 
_The Publisher validiates the Subscription Request_
![Relay_Validate](Relay_Validate.png)


### 5.3. Verification of Subscriber Itent
_The Publisher verifies the intent of the Subscriber_
![Relay_Verify](Relay_Verify.png)


6. Publishing
-------------
(Extends the PuSH specification.)
![Relay_Publish](Relay_Publish.png)

PuSH leaves it open as to how a Publisher sends content to a Hub. With Relay Publishers and Hubs both send tehir content to their Subscribers in an identical way - see Content Distribution.


7. Content Distribution
-----------------------
(Identical to the PuSH specification.)
![Relay_Distribute](Relay_Distribute.png)

Publisher Request:

    POST <subscriber_callback_url> HTTP/1.1
    Content-Type: <topic_content_type>
    Link: <hub_url>; rel=hub, <topic_url>; rel=self

Subscriber Response (sucess):

    HTTP/1.1 200 OK



9. Topic Proxing
----------------

It is implicit in the Realy specification that topics can be proxied. In a chain of Publisher, to Hub, to Hub to Subscriber the intermediaty hubs are esentially proxing POSTs requests on.

By defaul Relay is _transparent_ about the proxy chain. The Publisher will always serve the topic and adertise all the hubs that can be subscribed to.

Publishers may choose to to make the proxy chain _opaque_. One reason to do this would be to protect the original origin servers of the Publisher or if using Realy both internally in a private subnet and external on the public internet a Hub can be used to bridge the two nextworks. These scenarios SHOULD be configured as follows:

Publisher publishes Topic under the URL `<topic_url_hidden>`. This may simply not published, so hard to discover, actively protected, so only autorised users can access it, or on a private subnet and DNS so unavailable to the gloabl internet.


The Publisher's Contract
------------------------

A Realy Publisher...
1. MUST meet the specification of a PuSH Publisher and a PuSH Hub. (A Realy Publisher MAY choose to only allow one Subscriber and nominate it as it's Hub. Any other Subscribers wanting to receive the Publisher's feed can then subscribe to this Hub. This scenario mirrors a normal PuSH protocol.)
2. SHOULD allow subscribers to cath up with recent history of a feed (e.g. to allow a Subscriber to catch up or self correct if it has been offline for some time). If it does it MUST follow the Relay feed catch up specification.
3. MAY allow subscribers to retrive a long history of a feed. If it does it MUST follow the Relay feed archive spcification.

In realisty points 2 and 3 work together.


Failiure Scenario:

- A Publisher POSTS content faster than a subscriber can keep up. Subscriber SHOULD make every attempt possible to avoid a server / process "crash". Subscriber SHOULD return an error to and more POST requests from the Publisher (specific error to be agreed). Subscriber SHOULD unsubscribe from the feed as sson as possible. Publisher MUST cancel the subscription i.e. send no more POST requests to the Subscriber.


Discovery
---------
Subscriber initiates at GET or HEAD HTTP request.

GET FEEDURL HTTP/1.1


The Feed Catchup Specification.

Publisher Reponse:    
    HTTP/1.1 200 OK
    Content-Type: text/xml; charset=utf-8
    Content-Length: length
    ETag: ABC
    Varies: ETag
    Link: <URI>; rel=hub, <URI>; rel=self

Later on:

Publisher Request (suceeds):    
    POST SUBRIBER_CALLBACK_URL HTTP/1.1
    Content-Type: text/xml; charset=utf-8
    Content-Length: length
    ETag: DEF
    Varies: ETag
    Link: <URI>; rel=hub, <URI>; rel=self


Publisher Request (fails):    
    POST SUBRIBER_CALLBACK_URL HTTP/1.1
    Content-Type: text/xml; charset=utf-8
    Content-Length: length
    ETag: GHI
    Varies: ETag
    Link: <URI>; rel=hub, <URI>; rel=self



When the Subscriber is ready to recover:    

Subscriber Resubscribers:


Subscriber Request:
    GET FEEDURL HTTP/1.1
    Host: hostname.com
    ETag: ABCDE


Publisher Response:    
    HTTP/1.1 200 OK
    Content-Type: text/xml; charset=utf-8
    Content-Length: length
    ETag: ABC
    Varies: ETag
    Link: ; rel=hub
    Link: ; rel=self
    
    <... the missing items...>



The Subscribers's Contract
--------------------------


References
----------

*[PubSubHubbub Core 0.4 -- Working Draft](https://pubsubhubbub.googlecode.com/git/pubsubhubbub-core-0.4.html)
*RFC4287  Nottingham, M., Ed. and R. Sayre, Ed., [The Atom Syndication Format](http://www.ietf.org/rfc/rfc4287.txt)

