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
