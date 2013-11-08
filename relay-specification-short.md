Relay
=====

_Publish. Subscribe. Syndicate._

    ------->
    P      S 
    <-------  

Core specification
------------------

* Relay - A protocol for syndicating content using a publish subscribe pattern.
* __Status:__ DRAFT
* __Latest Published Version:__
    *  __Long Version:__ [https://github.com/aogriffiths/relay/blob/spec-published/relay-specification.md]
    *  __Short Version:__ [https://github.com/aogriffiths/relay/blob/spec-published/relay-specification-short.md]
*  __Latest Editor's Draft:__
    *  __Long Version:__ [https://github.com/aogriffiths/relay/blob/spec-master/relay-specification.md]
    *  __Short Version:__ [https://github.com/aogriffiths/relay/blob/spec-master/relay-specification-short.md]
*  __Editor(s):__ 
    *  Adam Griffiths
* __See Also:__ [https://github.com/aogriffiths/relay/blob/spec-master/README.md]


Long versions includes examples and useful extracts from the PubSubHubbub
specification. Short versions omit these and other non-normative information.

The Published versions are official approved releases of the specification. The Editor's Draft
is the latest _work in progress_ version.

If you are implementing Relay or would find background and examples useful read
the long versions. If you are only looking for the normative parts of the
specifications or to see how simple the specification really is, read the short versions.


<br/>
************************************************************************************************************************
Abstract
------------------------------------------------------------------------------------------------------------------------

This document specifies "Relay", a protocol for syndicating content following the 
publish subscribe pattern.



<br/>
************************************************************************************************************************
Introduction
------------------------------------------------------------------------------------------------------------------------

Relay is inspired by and compatible with PubSubHubbub (PuSH). It also has some
additional features that you might find useful. Relay considers any server to
be capable of being a Publisher, a Subscriber, a Hub or all three and content is effectively "_relayed_" from the Publisher to Subscribers (optionally) via one or more Hubs.


The main difference to PuSH is that Relay requires all Publishers publish 
their content using exactly the same protocol as Hubs use to distribute content.  
In other words a Publisher sends content to a Hub in exactly the same way as a 
Hub sends content to a Subscriber. The benefits are:

* __Simplicity:__ All content is send between Publishers, Subscribers and Hubs 
  using the same protocol.
* __Compatibility:__ Relay is compatible with PuSH v0.4.
* __Relaying:__ A chain of Hubs can be created for "_relaying_" content. (This can be 
  useful for distributing load or moving content from within a private network, using a private Hub, 
  to the public Internet, using a public Hub.)



<br/>
<a name="1."></a>
************************************************************************************************************************
1. Notation and Conventions
------------------------------------------------------------------------------------------------------------------------

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be
interpreted as described in [RFC2119](http://www.ietf.org/rfc/rfc2119.txt).



<br/>
<a name="2."></a>
************************************************************************************************************************
2. Definitions
------------------------------------------------------------------------------------------------------------------------

### Specific Definitions

* __PuSH:__ When the word "push" is capitalised as "PuSH" it refers to
  PubSubHubbub, and unless otherwise specified, version 0.4.
* __Topic/Feed:__ The words "feed" and "topic" are used interchangeably. A Topic
  is the unit to which one can subscribe to. It is a collection of entries.
* __Entry/Item:__ A topic is a collection of entries (Synonymous with a feed
  being a collection of items).
* __Publisher:__ (_noun_). An entity that sends notifications of Changes to a
  Topic.
* __Originating Publisher:__ (_noun_). The Publisher entity that owns a Topic.
  They are the originating source and the only system where changes to
  the topic and it's entries can be authored.
* __To publish:__ (_verb_). The process of notifying subscribers of changes to a
  Topic. The originating Publisher MUST _publish_ the Topic using the Relay
  specification. Other systems MAY also re-_publish_ the Topic, in which case
  they are acting as a Hub.
* __Subscriber:__ (_noun_). An entity that receives notifications of changes to
  a Topic.
* __To subscribe:__ (_verb_). The process of requesting a Publisher publishes to
  a Subscriber on an on going basis. Usually initiated by the subscriber.
* __Hub:__ An entity that both subscribers to a Topic and publishes it. A Hub
  re-publishes ("_relays_") a Topic.

### General Concepts

* All Relay Publishers are their own Hubs. 
* A Publisher follows the same approach to _publishing_ content as a Hub
follows for _distributing_ it. PuSH uses "publishing" and "distributing" to
refer to slightly different things but Relay seeks to make them the same
thing.
* Hubs subscribe to Publishers or other Hubs.
* Subscribers subscribe to Hubs or Publishers.


<br/>
<a name="3."></a>
************************************************************************************************************************
3. High-level protocol flow
------------------------------------------------------------------------------------------------------------------------

The protocol for Relay following the protocol PuSH and is outlined in sections
4 to 7 of this specification.

<!-- Long Spec START --> 
The following information is non-normative but serves
as an overview of the protocol and index to sections 4 to 7 in this specification.

* __[4. Discovery ](#4.)__ - A Subscriber discovers a Topic from a Publisher
  and how to subscribe to it.

* __[5. Subscription ](#5.)__ - The Subscriber subscribes to the Topic to
  receive notification when it changes.
    * __[5.1. Subscription Request ](#5.1.)__ - The Subscriber sends a 
      Subscription Request to a Hub. 
    * __[5.2. Subscription Validation ](#5.2.)__ - The Hub validates the 
      Subscription Request.
    * __[5.3. Subscriber Verification ](#5.3.)__ - The Hub verifies the intent of
      the Subscriber.
    * __[5.4. Subscription Renewall](#5.4.)__ - The Hub periodically confirms 
      with the Subscriber to check if the subscription is still required.
    * __[5.5. Subscription Denial ](#5.5.)__ - The Hub informs the Subscriber that
      the subscription has been denied and is not (or no longer) active.

* __[6. Publishing ](#6.)__ - Publishers POST any topic changes to their subscriber(s)
  (which many be Hubs). 

* __[7. Content Distribution ](#7.)__ - When Hubs receive
  POSTed Topic changes the POST them on to their subscriber(s), which many also
  be Hubs, so the chain continues until all Hubs and Subscribers are reached.
  (_Publishing and Relay-Publishing are done in an identical way and follow the
  PusH specification part 7_)

* __[8. Authenticated Content Distribution ](#8.)__ - 

<!-- Long Spec END -->


<br/>
<a name="4.">
************************************************************************************************************************
4. Discovery
------------------------------------------------------------------------------------------------------------------------
_The Subscriber discovers from a Publisher the Hub(s) which it is publishing to._



1. Adhere to section 4. "Discovery" in the PuSH v0.4 specification.

2. <a name="4.2"></a> 
   __Topic URLS:__ The URL from which the topic is retrieved during discovery 
   SHOULD be referred  to as the "requested_topic_url". The the self link header
   returned (with  rel=self) SHOULD be referred to as the
   "advertised_topic_url". Generally the requested_topic_url and the
   advertised_topic_url will be the same and are jointly be referred to as the
   "topic_url" in the Relay and PuSH specifications. If there is any ambiguity,
   topic_url MUST be assumed to mean the advertised_topic_url when one is
   available and the requested_topic_url when there is not. In effect this means
   the advertised_topic_url overrides the requested_topic_url.

3. __Hub Links:__ There MAY be more than one hub link header (with rel=hub). If 
   so Subscribers MAY subscriber to one or more Hub. Subscribing to one is
   RECOMMENDED and Subscribers SHOULD use the first first hub link provided
   unless there is a reason not to. Publishes SHOULD put their preferred hub
   first in the order of hub link headers. The selected Hub URL SHOULD be
   referred to as the "advertised_hub_url". (If there were several Hubs advertised 
   this might more accurately be called the selected_hub_url_from_the_advertised_urls
   but this documentation abbreviates it to just the advertised_hub_url!)

4. __Publisher's Own Hub:__ Relay requires all Publishers MUST be capable of 
   being their own hub. It is therefore RECOMMENDED that at least one hub link
   header returned by a Publisher is their own Hub URL. Publishers MAY choose
   not do do this if they are no longer accepting direct subscriptions but MUST
   always return at least one Hub URL, referring to a Hub that they are
   actively distributing content to.

5. __Publishers Fall Back:__ Relay Publishers MAY OPTIONALLY provide the other
   methods methods of discovery refereed to in the PuSH 0.3 and PuSH 0.4
   specification. However this is NOT REQUIRED to support Relay and should only
   be considered for supporting PuSH 0.3 Subscribers.

6. __Subscriber Fall Back:__ Relay Subscribers MAY OPTIONALLY fall back to
   alternative methods of discovery. However this is NOT REQUIRED to support
   Relay or PuSH 0.4 Publishers and should only be considered for
   supporting PuSH 0.3 Publishers.




<br/>
<a name="5."></a>
************************************************************************************************************************
5. Subscribing and Unsubscribing
------------------------------------------------------------------------------------------------------------------------

1. Adhere to section 5. "Subscribing and Unsubscribing" in the PuSH 0.4 specification

2. (non-normative) The following notes are useful if you wish to read the Relay 
   specification in conjunction with the PuSH specification:
   * Sections 5.1, 5.2, 5.3 and 5.4 in this specification map to the four bullets in 
     section 5 of the PuSH 0.4 specification. 
   * Sections 5.1, 5.2, 5.3 in this specification relate to sections of the same 
     numbers in the PuSH 0.4 specification. 
   * Section 5.4 in this specification describes subscription reconfirming / renewal, 
     of a subscription which is mentioned in various places in the PuSH 0.4 specification. 
   * Section 5.5 in this specification describes subscription
     denying, which is referred to in section 5.2 of the PuSH 0.4 specification.


<br/>
<a name="5.1."></a>
************************************************************************************************************************
### 5.1. Subscription Request

_The Subscriber sends a Subscription Request to a Hub_



1. Adhere to sections 5.1, 5.1.1 and 5.1.2 "Subscriber 
   Sends Subscription Request" in the PuSH v0.4 specification.

2. The topic URL (hub.topic) MUST be the advertised_topic_url as defined in 
   [section 4 point 2](#4.2) of this specification. The hub URL mus


3. <a name="5.1.3"></a>
   A well formed subscription request MUST meet the following criteria:
    * `hub.callback` is present and is a valid URL 
    * `hub.mode` is present and is either "subscribe" or "unsubscribe". If it is
        "unsubscribe" the Hub MUST have an existing subscription for the given tuple 
        {hub.topic, hub.callback}.
    * `hub.topic` is present and is one the Hub is able to distribute. 
        This means the Hub is either already subscribing to this topic or the Hub
        is willing to "auto subscribe" and set up a new subscription to this
        topic.

4. A well formed subscription request MAY meet the following criteria:
    * `hub.lease_seconds` is present and is a number
    * `hub.secret` is present and is alphanumeric


<br/>
<a name="5.2."></a>
************************************************************************************************************************
### 5.2. Subscription Validation 

_The Hub validates the Subscription Request_



1. Adhere to section 5.2 "Subscription Validation" in the PuSH v0.4 specification.

2. Validation SHOULD include the hub checking the subscription request is well 
   formed as defined in [section 5.1 point 3](#5.1.3) in this specification.

3. Validation MAY include ensuring the subscriber or publisher have not 
   been blacklisted and the Hub is "willing" to maintain the new subscription
   that is being requested.

> If (and when), the subscription is accepted, the hub MUST perform the
> verification of intent of the subscriber.
>
> If (and when), the subscription is denied, the hub MUST inform the
> subscriber by sending an HTTP [RFC2616] GET request to the subscriber's
> callback URL as given in the subscription request. This request has the
> following query string arguments appended (format described in Section
> 17.13.4 of [W3C.REC‑html401‑19991224]):

4. If (and when) validation succeeds (the subscription is accepted) the hub MUST 
   complete the Verification step. See section 5.3 of this specification.

5. If (and when) validation fails (the subscription is denied) the hub MUST 
   inform the subscriber that the subscription
   has been denied. See section 5.5 of this specification.


6. The Hub MAY integrate with the original Publisher for further validation of 
   the subscription. This specification does not recommend how that is done but
   an approach may be specified in a suitable a relay extension. (However it 
   is worth noting that after a Publisher distributes content to a Hub is 
   technically cannot mandate what the Hub does with that content afterwards.
   Fair use or contractual policies may go some way to addressing this but 
   Publishers should only distribute content to Hubs that they trust.)



<br/>
<a name="5.3."></a>
************************************************************************************************************************
### 5\.3\. Subscriber Verification

_The Publisher verifies the intent of the Subscriber_



(Meets the PuSH Specification)


<br/>
<a name="5.4."></a>
************************************************************************************************************************
### 5.4. Subscription Renewal

3.  Subscriber is given a number of `lease_seconds` and MUST resubscribe before
   these have elapsed.

<br/>
<a name="5.5."></a>
************************************************************************************************************************
### 5.5. Subscription Denial

_Hub informs the Subscriber when a subscription is denied_



(Meets the PuSH Specification, see section 5.2 in the PuSH 0.4 specification)


<br/>
<a name="6."></a>
************************************************************************************************************************
6. Publishing
------------------------------------------------------------------------------------------------------------------------
_The Publisher sends updates to it's Hubs and any other Subscribers_



(Meets and Extends the PuSH specification.)
(_Compatible with the PusH spec part 3, 1st bullet.
Different to part 3, 3rd bullet, but that's fine as per part 6_)




<br/><br/><a name="7."></a>
************************************************************************************************************************
7. Content Distribution
------------------------------------------------------------------------------------------------------------------------

_Hub sends updates to Subscribers and any other Hubs_


(Meets and Extends the PuSH specification.)





<br/><br/><a name="8."></a>
************************************************************************************************************************
8. Authenticated Content Distribution
------------------------------------------------------------------------------------------------------------------------

TODO



************************************************************************************************************************
References
------------------------------------------------------------------------------------------------------------------------

* [PubSubHubbub Core 0.4 -- Working Draft]
  (https://pubsubhubbub.googlecode.com/git/pubsubhubbub-core-0.4.html)
* RFC4287  Nottingham, M., Ed. and R. Sayre, Ed., [The Atom Syndication Format]
  (http://www.ietf.org/rfc/rfc4287.txt)




























