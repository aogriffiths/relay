Relay
=====

    ------->
    P      S 
    <-------  

_Publish. Subscribe. Webhook. Syndicate._


Relay Extension Specification(s)
--------------------------------

Relay Extensions - A range of optional extensions to Relay.

* __Status:__ DRAFT
* __Latest Published Version:__
    *  Long Version: https://github.com/aogriffiths/relay/blob/spec-published/relay-extensions.md
    *  Short Version:__ https://github.com/aogriffiths/relay/blob/spec-published/relay-extensions-short.md
*  __Latest Editor's Draft:__
    *  Long Version: https://github.com/aogriffiths/relay/blob/spec-master/relay-extensions.md
    *  Short Version: https://github.com/aogriffiths/relay/blob/spec-master/relay-extensions-short.md
*  __Editor(s):__ 
    *  Adam Griffiths
* __See Also:__ https://github.com/aogriffiths/relay/blob/spec-master/README.md

Long versions includes examples and useful extracts from the PubSubHubbub
specification. Short versions omit these and other non-normative information.

The Published versions are official approved releases of the specification.
The Editor's Draft is the latest _work in progress_ version.

If you are implementing Relay or would find background and examples useful
read the long versions. If you are only looking for the normative parts of the
specifications or to see how simple the specification really is, read the
short versions.


<br/>
************************************************************************************************************************
Abstract
------------------------------------------------------------------------------------------------------------------------

This document specifies a range of optional extenstions to Realy.



<br/>
************************************************************************************************************************
Introduction
------------------------------------------------------------------------------------------------------------------------

This document provides specifications for:

* __[1. Topic Proxying](#1.)__ A Hub normally acts as a sort of transparaent proxy, it doesn't hide the fact it is proxying content from a Publisher. However with the Topic Proxying extension a Hub can act as a opaque proxy, efectively hiding the fact a topic was originally published elsewhere and making it look like the Hub itself is the originating publisher.

* __[1. Linked Content](#1.)__ Topics may contain links to other content, such as images or related assets. This extentoins describes how Realy can handel these.

* __[2. Handeling Failiures](#2.)__ - Publishers SHOULD stop POSTing to Subscribers
  after an agreed number of retrys fail. Both Publishers and Subscribers SHOULD
  follow the Relay specification for detecting, altering and recovering failed
  subscriptions.

* __[3. Catchup and History](#3.)__ - Publishers SHOULD support one of two mechansims
  to allo Subscribers to catchup or get historical Topic entries. This is usful
  for Subscribers after recovering from a failiure or at the point of initial
  subscription.


<br/>
<a name="1."></a>
************************************************************************************************************************
1. Notation and Conventions
------------------------------------------------------------------------------------------------------------------------

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be
interpreted as described in [RFC2119](http://www.ietf.org/rfc/rfc2119.txt).




<br/>
<a name="1."></a>
************************************************************************************************************************
1. Topic Proxing
------------------------------------------------------------------------------------------------------------------------


It is implicit in the Realy specification that topics can be proxied. In a
chain of Publisher, to Hub, to Hub to Subscriber the intermediaty hubs are
esentially proxing POSTs requests on.

By defaul Relay is _transparent_ about the proxy chain. The Publisher will
always serve the topic and adertise all the hubs that can be subscribed to.

Publishers may choose to to make the proxy chain _opaque_. One reason to do
this would be to protect the original origin servers of the Publisher or if
using Realy both internally in a private subnet and external on the public
internet a Hub can be used to bridge the two nextworks. These scenarios SHOULD
be configured as follows:

Publisher publishes Topic under the URL `<topic_url_hidden>`. This may simply
not published, so hard to discover, actively protected, so only autorised
users can access it, or on a private subnet and DNS so unavailable to the
gloabl internet.


<br/>
<a name="1."></a>
************************************************************************************************************************
1. Hub Awareness 
------------------------------------------------------------------------------------------------------------------------
_This extension is OPTIONAL, however implementations that do support it MUST meet
the following specification._

If a Subscriber is a Hub itself it MUST make this known to any hubs it 
subscribes to at the time of subscribing. This 




************************************************************************************************************************

************************************************************************************************************************

************************************************************************************************************************

************************************************************************************************************************

Feed Types

Create Only

With this feed type Topic Entries can only ever be created, they can't be updated or deleted. A good example would be log entries (e.g. lines in a log file). It may not be essential to preserve the order of the feed, or if order is important the reciving party can persist new Entries in any order and sort them into order later. For example log file entries are usauly in timestamp order, of they are sent to a Subscriber and though various Hubs and internet latencies they get out of order the Subscriber can always resort them by timestamp in the future.


Create Update

Order is much more important with feeds that allow updates. It must be possible to know which updates come after others so as not to apply an old update after a more recent one.

Create Update Delete


OLD Content TO Sort Out
=======================



>> Thin vs. Fat. Fat pings contain everything required to update the
>> subscriber. Thin pings MAY require a subscriber calls back to the Publisher
>> to get a complete copy of changed topic. Publishers MUST support fat pings
>> and MAY support thin pings. Subscribers MUST suport the types of ping they
>> intend to subscribe to, ideally this would be both to support general
>> robustness.

>> * The hub caches minimal metadata (id, data, entry digest) about each
>> * topic's previous state. When the hub re-fetches a topic feed (on its own
>> * initiative or as a result of a publisher's ping) and finds a delta, it
>> * enqueues a notification to all registered subscribers.

>> * Realy also supports chaining, such that one Realy Publisher can publish
>> * to a chain or network of Realy Hubs which can eventaully pubish to a
>> * Realy Subscriber.



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


************************************************************************************************************************
References
------------------------------------------------------------------------------------------------------------------------

* [PubSubHubbub Core 0.4 -- Working Draft]
  (https://pubsubhubbub.googlecode.com/git/pubsubhubbub-core-0.4.html)
* RFC4287  Nottingham, M., Ed. and R. Sayre, Ed., [The Atom Syndication Format]
  (http://www.ietf.org/rfc/rfc4287.txt)

