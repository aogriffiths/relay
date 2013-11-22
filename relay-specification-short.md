Relay
=====

    ------->
    P      S 
    <-------  

_Publish. Subscribe. Webhook. Syndicate._

Core specification
------------------

Relay - a protocol for syndicating content following a publish / subscribe and
webhook pattern.

* __Status:__ DRAFT
* __Latest Published Version:__
    *  Long Version:  https://github.com/aogriffiths/relay/blob/spec-published/relay-specification.md
    *  Short Version: https://github.com/aogriffiths/relay/blob/spec-published/relay-specification-short.md
*  __Latest Editor's Draft:__
    *  Long Version:  https://github.com/aogriffiths/relay/blob/spec-master/relay-specification.md
    *  Short Version: https://github.com/aogriffiths/relay/blob/spec-master/relay-specification-short.md
*  __Editor(s):__ 
    *  Adam Griffiths
* __See Also:__ https://github.com/aogriffiths/relay/blob/spec-master/README.md


Long versions includes examples and useful extracts from the PubSubHubbub
specification. __Read these if you are implementing Relay or would find
background and examples useful.__

Short versions omit these and other non-normative information. __Read the these
if you are only looking for the normative parts of the specifications or to see
how simple the specification really is.__

The Published versions are official approved releases of the specification. The
Editor's Draft is the latest _work in progress_ version.



<br/>
************************************************************************************************************************
Abstract
------------------------------------------------------------------------------------------------------------------------

This document specifies "Relay" - a protocol for syndicating content following a
publish / subscribe and webhook pattern.



<br/>
************************************************************************************************************************
Introduction
------------------------------------------------------------------------------------------------------------------------

Relay is inspired by and compatible with PubSubHubbub (PuSH). It also has
additional features and extensions that you might find useful. Any Relay server 
can be capable of being a Publisher, a Subscriber, a Hub or all three
and content is "_relayed_" between them.


The main difference to PuSH is that Relay requires Publishers publish 
content following the same protocol as Hubs use to distribute content. In other
words a Publisher sends content to a Hub in exactly the same way as a Hub sends
content to a Subscriber. The benefits are:

* __Simplicity:__ All content is sent between Publishers, Subscribers and Hubs 
  using the same protocol.
* __Compatibility:__ Relay is compatible with PuSH v0.4.
*  __Relaying:__ A chain of Hubs can be created for "_relaying_" content. This
  can be useful for distributing load or creating a proxy or / reverse proxy 
  Hub between Publishers and Subscribers.



<br/>
<a name="1."></a>
************************************************************************************************************************
1. Notation and Conventions
------------------------------------------------------------------------------------------------------------------------

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be
interpreted as described in [RFC2119](http://www.ietf.org/rfc/rfc2119.txt).

Normative sections of this document are prescriptive parts of the specification.
Informative sections are non-normative and although not part of the prescriptive
specification they provide additional useful information (e.g. introduction,
fragments of other specifications and examples.). If a section is not explicitly 
indicated as normative or informative it should be assumed to be normative.

<!-- Long Spec START -->   

In some sections a "reference implementation" is provided which suggests
specific URLS and http conventions to use when implementing Relay. These do not
need to be adhered to to be Relay compliant but they provide some simple
suggestions that may help when implementing Relay.

<!-- Long Spec END -->   

<br/>
<a name="2."></a>
************************************************************************************************************************
2. Definitions
------------------------------------------------------------------------------------------------------------------------

### General Concepts (Informative)

1. In PuSH parlance all Relay Publishers are "their own Hubs". 
2. A Publisher follows the same approach to _publishing_ content as a Hub
   follows for _distributing_ it. 
3. Building on points 1 and 2, Relay allows Hubs or Subscribers
   to subscribe to Publishers or other Hubs. This creates four scenarios:
      * A Hub subscribing to a Publisher.
      * A Hub subscribing to a Hub.
      * A Subscriber subscribing to a Publisher.
      * A Subscriber subscribing to a Hub.

   To describe these four scenarios more simply the Publisher/Hub being 
   subscribed to can be referred to as the "sending party" and the Hub/Subscriber 
   receiving updates can be referred to as the "receiving party".


### Specific Definitions (Normative)

##### Feed Basics 
 
* __PuSH:__ When the word "push" is capitalised as "PuSH" it refers to
  PubSubHubbub, and unless otherwise specified, version 0.4.
* __Relay:__ The PuSH compliment protocol specified in this document.
* __Topic/Feed:__ The words "feed" and "topic" are used interchangeably. A Topic
  is the unit to which one can subscribe to. It is a collection of entries.
* __Entry/Item:__ A topic is a collection of entries (synonymous with a feed
  being a collection of items).


##### PuSH Entities 

These are defined by PuSH and the following definitions provide the salient 
points as they relate to Relay.

* __Publisher:__ (_noun_). The entity that masters all updates to a Topic and
  makes them available using the PuSH/Relay protocols.
* __Hub:__ An entity that receives updates to a Topic from a Publisher and 
  distributes them to Subscribers. 
* __Subscriber:__ (_noun_). An entity that receives changes to a Topic.


##### PuSH Actions 

These are defined by PuSH and the following definitions provide the salient 
points as they relate to Relay.

* __To Publish:__ (_verb_). The action of a Publisher notifying Hubs of changes 
  to a Topic. 
* __To Distribute:__ (_verb_). The action of a Hub notifying Subscribers of 
  changes to a Topic. 
* __To Subscribe:__ (_verb_). The action a Subscriber 
  takes to request a Hub sends it any changes to a Topic on an ongoing basis. 

##### Relay Entities

* __Sending Party: (_noun_).__ Either a Publisher that publishes a Topic or Hub 
  that distributes a Topic.
* __Receiving Party: (_noun_).__ Either a Hub or a Subscriber that receives updates
  to a Topic.

##### Relay Actions

* __To Send:__ (_verb_). The action a Sending Party takes to send changes to a 
 Topic to a Receiving Party.
* __To Subscribe:__ (_verb_). The action a Receiving Party 
  takes to request a Sending Party sends it any changes to a Topic on an ongoing 
  basis. 



<br/>
<a name="3."></a>
************************************************************************************************************************
3. High-level Protocol Flow
------------------------------------------------------------------------------------------------------------------------


<br/>
<a name="4.">
************************************************************************************************************************
4. Discovery
------------------------------------------------------------------------------------------------------------------------

_The Subscriber discovers which Hub(s) a Publisher is using_



1. Adhere to section 4. "Discovery" in the PuSH v0.4 specification.

2. <a name="4.2"></a> 
   __Topic URLS:__ The URL from which the topic is retrieved during discovery 
   SHOULD be referred to as the "requested_topic_url". The the self link header
   returned (with rel=self) SHOULD be referred to as the
   "advertised_topic_url". Generally the requested_topic_url and the
   advertised_topic_url will be the same and are jointly be referred to as the
   "topic_url" in the Relay and PuSH specifications. If there is any ambiguity,
   topic_url MUST be assumed to mean the advertised_topic_url when one is
   available and the requested_topic_url when there is not. In effect this means
   the advertised_topic_url overrides the requested_topic_url.

3. <a name="4.3"></a> 
   __Hub URLS:__ There MAY be one or more hub link headers (with rel=hub), each
   containing a hub_url which are collectively referred to as the
   advertised_hub_urls. Subscribers MAY subscribe to one or more of these.
   Subscribing to one is RECOMMENDED and Subscribers SHOULD use the first hub
   link provided unless there is a valid reason not to. Publishes SHOULD put
   their preferred hub first in the order of hub link headers.

4. __Publisher's Own Hub:__ Relay requires all Publishers MUST be capable of 
   being their own hub. It is therefore RECOMMENDED that at least one hub link
   header returned by a Publisher is their own Hub URL. Publishers MAY choose
   not to do this if they are no longer accepting direct subscriptions but MUST
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

_The Subscriber subscribes to a Hub for a Topic_


1. Observe to the Publisher / Hub Similarities as explained in 
   [3. High-level Protocol Flow](#3.). Effectively this means this section of 
   the specification needs to be implemented twice, once for the scenario where
   a Subscriber subscribes to a Hub and once for the scenario where a Hub
   subscribes to a Publisher. (By doing this the Hub to Hub and Subscriber
   direct to Publisher scenarios will also be possible.)

2. Adhere to section 5. "Subscribing and Unsubscribing" in the PuSH 0.4 
   specification.



<br/>
<a name="5.1."></a>
************************************************************************************************************************
### 5.1. Subscription Request

_The Subscriber sends a Subscription Request to a Hub_



1. Adhere to sections 5.1, 5.1.1 and 5.1.2 "Subscriber 
   Sends Subscription Request" in the PuSH v0.4 specification.

2. The "topic URL" (hub.topic) MUST be the advertised_topic_url as defined in 
   [section 4 point 2](#4.2). 

3. The "hub URL" must be one of the advertised_hub_urls as defined in 
   [section 4 point 3](#4.3).

4. <a name="5.1.4"></a>
   A well formed subscription request MUST meet the following criteria:
    * `hub.callback` is present and is a valid URL 
    * `hub.mode` is present and is either "subscribe" or "unsubscribe". If it is
        "unsubscribe" the Hub MUST have an existing subscription for the given tuple 
        {hub.topic, hub.callback}.
    * `hub.topic` is present and is one the Hub is able to distribute. 
        This means the Hub is either already subscribing to this topic or the Hub
        is willing to "auto subscribe" and set up a new subscription to this
        topic.

5. A well formed subscription request MAY meet the following criteria:
    * `hub.lease_seconds` is present and is a number
    * `hub.secret` is present and is alphanumeric


<br/>
<a name="5.2."></a>
************************************************************************************************************************
### 5.2. Subscription Validation 

_The Hub validates the Subscription Request_



1. Adhere to section 5.2 "Subscription Validation" in the PuSH v0.4 specification.

2. Validation SHOULD include the hub checking the subscription request is well 
   formed as defined in [section 5.1 point 4](#5.1.4).

3. Validation MAY include ensuring the subscriber or publisher have not 
   been blacklisted and the Hub is "willing" to maintain the new subscription
   that is being requested.

4. If (and when) validation succeeds (the subscription is accepted) the hub MUST 
   complete the Verification step. See [section 5.3](#5.3) of this specification.

5. If (and when) validation fails (the subscription is denied) the hub MUST 
   complete the Denial step. See [section 5.5](#5.5) of this specification.

6. The Hub MAY integrate with the original Publisher for further validation of 
   the subscription. This specification does not suggest how that is done but
   an approach may be specified in a suitable a relay extension. (However it 
   is worth noting that after a Publisher distributes content to a Hub is 
   technically cannot mandate what the Hub does with that content.
   Fair use or contractual policies could go some way to addressing this but 
   Publishers should only distribute content to Hubs and Subscribers that they 
   trust.)



<br/>
<a name="5.3."></a>
************************************************************************************************************************
### 5\.3\. Subscriber Verification

_The Publisher verifies the intent of the Subscriber_




1. Adhere to section 5.3 "Hub Verifies Intent of the Subscriber" in the PuSH 
   v0.4 specification.


<br/>
<a name="5.4."></a>
************************************************************************************************************************
### 5.4. Subscription Renewal

_The Subscriber sends a Subscription Request to a Hub_


1. Hub MUST provide a number of `lease_seconds` in the Verification Request
   sent to the Subscriber. This MAY NOT be equal to the the number of lease 
   seconds the Subscriber requested in the Subscription Request.

2. The Subscriber MUST resubscribe before the number of lease seconds have 
   elapsed. The elapsed time is calculated as the number of seconds since the Verification 
   Request was sent by the Hub and MUST be based on the UTC time provided in the
   `Sent:` header of that request. To ensure Hubs and Subscribers make the same 
   calculation of elapsed time clocks should be accurately set and either Hub or 
   Subscriber MAY respond with an error if and when they discover a clock difference
   beyond normal tolerances.

2. A Hub MAY stop distributing to a Subscriber after `lease_seconds` have 
   elapsed. If a Hub will stop distributing it SHOULD allow a grace period number 
   of seconds before stopping, to allow for clock differences and any other 

3. The elapsed number of seconds MUST be calculated as the number of seconds 
   since the last successful subscription request was made.

4. Re-subscription follows exactly the same steps as the initial subscription, 
   starting with the steps described in [5.1. Subscription Request ](#5.1.).

<br/>
<a name="5.5."></a>
************************************************************************************************************************
### 5.5. Subscription Denial

_Hub informs the Subscriber when a subscription is denied_



1. Adhere to section 5.2 "Subscription Validation", paragraph 3 in the PuSH 
   v0.4 specification.


<br/>
<a name="6."></a>
************************************************************************************************************************
6. Publishing
------------------------------------------------------------------------------------------------------------------------

_The Publisher sends updates to it's Hubs and any other Subscribers_



#### Relay Specification (Informative)

1. Section 6 "Publishing" in the PuSH v0.4 specification leaves it open as to 
   how a Publisher sends content to a Hub. Relay makes use of this and requires
   Publishers and Hubs MUST send their content to their Subscribers in the same way. 
   In other words the Publishing protocol for Relay is identical to the Content 
   Distribution protocol. 

#### Relay Specification (Normative)

1. Adhere to section [7. Content Distribution](#7.) 


<br/><br/><a name="7."></a>
************************************************************************************************************************
7. Content Distribution
------------------------------------------------------------------------------------------------------------------------

_Hub or Publisher sends updates to other Hubs or to Subscribers_




1. Observe to the Publisher / Hub Similarities as explained in 
   [3. High-level Protocol Flow](#3.). Effectively this means this section of 
   the specification needs to be implemented twice, once for the scenario where
   a Hub sends content to a Subscriber and once for the scenario where a 
   Publisher sends content to a Hub. (By doing this the Hub to Hub and Publisher
   direct to Subscriber scenarios will also be possible.)

2. Adhere to section 7 "Content Distribution" of the PuSH v0.4 specification. 
   Treat all references to the "hub" as meaning the sending party in Relay terms. 
   Treat all references to the "subscriber" as meaning the receiving party in Relay terms. 

3. The hub_url (with rel=hub) must refer to a URL that belongs to the sending 
   party which handles subscription / unsubscription as described 
   in [5. Subscribing and Unsubscribing](#5.). It MUST be the same hub_url 
   that the receiving party originally used to subscribe to the sending party 
   (this allows the receiving party to accurately determine "who" the sending is
   and take appropriate action like look up shared secrets, unsubscribe, 
   resubscribe, ignore the request, etc).



<br/><br/><a name="8."></a>
************************************************************************************************************************
8. Authenticated Content Distribution
------------------------------------------------------------------------------------------------------------------------

_The Hub signs content distribution requests_


1. Adhere to section 8 "Authenticated Content Distribution" of the PuSH v0.4 specification.



************************************************************************************************************************
References
------------------------------------------------------------------------------------------------------------------------

* [PubSubHubbub Core 0.4 -- Working Draft]
  (https://pubsubhubbub.googlecode.com/git/pubsubhubbub-core-0.4.html)
* RFC2616
* RFC5988
* RFC2818

<!--
* RFC4287  Nottingham, M., Ed. and R. Sayre, Ed., [The Atom Syndication Format]
  (http://www.ietf.org/rfc/rfc4287.txt)
-->



























