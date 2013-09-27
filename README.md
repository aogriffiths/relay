Relay
=====

_Publish and subscribe to anything._

    ------->
    P      S 
    <-------  



Specification
=============

Status: DRAFT
Author(s): Adam Griffiths


Abstract
--------

This document specifies Relay, an open, simple, web-scale and publish sububscribe protocol.

Introduction
------------

Relay is inspired by and compatible with PubSubHubbub (PuSH) but has some additional features that you may find useful. Realy considers any server to be capable of being a Publisher, a Subscriber, a Hub or all three. What does this mean?

- A Subscriber gets a feed directly from a Publisher.
- A Publisher can have many Subscribers.
- A Subsriber can get a feed indirectly from a Hub which gets the feed from a Publisher.

A picture is worth a thousand words:

![RelayPuSH](RelayPuSH.png)


Notation and Conventions
------------------------

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119](http://www.ietf.org/rfc/rfc2119.txt). 

When the workd push is capitalised as "PuSH" it refers to PubSubHubbub v0.4.


High-level protocol flow
------------------------
(This section is non-normative.)

* Publishers notify their hub(s) URLs when their topic(s) change.
* Subscribers POST to one or more of the advertised hubs for a topic they're interested in. Alternatively, some hubs may offer auto-polling capability, to let {their,any} subscribers subscribe to topics which don't advertise a hub.
* The hub caches minimal metadata (id, data, entry digest) about each topic's previous state. When the hub re-fetches a topic feed (on its own initiative or as a result of a publisher's ping) and finds a delta, it enqueues a notification to all registered subscribers.

* Realy also supports chaining, such that one Realy Publisher can publish to a chain or network of Realy Hubs which can eventaully pubish to a Realy Subscriber.


The Publisher's Contract
------------------------

A Realy Publisher MUST meet the specification of a PuSH Publisher and a PuSH Hub. However a Realy Publisher MAY choose to only allow one Subscriber and nominate that Subscriber as it's Hub. Any other Subscribers wanting to receive the Publisher's feed MUST  subscribe to this Hub. This scenario mirrows a normal PuSH configuration, they only difference is that Realy specifies how the Publisher ingrates with it's Hub and PuSH does not.




The Subscribers's Contract
--------------------------


References
----------

*[PubSubHubbub Core 0.4 -- Working Draft](https://pubsubhubbub.googlecode.com/git/pubsubhubbub-core-0.4.html)
*RFC4287  Nottingham, M., Ed. and R. Sayre, Ed., [The Atom Syndication Format](http://www.ietf.org/rfc/rfc4287.txt)

