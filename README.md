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


<br/>
<br/>
************************************************************************************************************************
Abstract
------------------------------------------------------------------------------------------------------------------------

This document specifies "Relay", a syndication protocol for publishing and
subscribing to feeds.



<br/>
<br/>
************************************************************************************************************************
Introduction
------------------------------------------------------------------------------------------------------------------------


Relay is inspired by and compatible with PubSubHubbub (PuSH) but has some
additional features that you might find useful. Realy considers any server to
be capable of being a Publisher, a Subscriber, a Hub or all three. What does
this mean? A picture is worth a thousand words:

![Relay_PuSH](Relay_PuSH.png)


In PuSH parlance Relay requires all Publishers are thier own Hubs. It alows
Publishers and Hubs to push feeds to Subscribers or other Hubs in exactly the
same way. This means Realy is as capable as, and compatible with PuSH, but
brings some additional benefits too, like:

* Publishers push to Hubs using exactly the same protocol as Hubs push to 
  Subscribers.
* A chain of Hubs can be created. 

There are also lots of other goodies in the Realy spec, so read on...


<br/>
<br/>
<a id="1."></a>
************************************************************************************************************************
1. Notation and Conventions
------------------------------------------------------------------------------------------------------------------------

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be
interpreted as described in [RFC2119](http://www.ietf.org/rfc/rfc2119.txt).



<br/>
<br/>
<a id="2."></a>
************************************************************************************************************************
2. Definitions
------------------------------------------------------------------------------------------------------------------------

If you are familiure with PuSH you should find the following definaitions similar. 

### Specific Definations

__PuSH:__ When the word "push" is capitalised as "PuSH" it refers to
PubSubHubbub, and unless otherwise specifided, version 0.4.

__Topic/Feed: __ The words "feed" and "topic" are used intechangably. A Topic
is the unit to which one can subscribe to. It is a collection of entries.

__Entry/Item:__ A topic is a collection of entries (Synonymous with a feed
being a collection of items).

__Publisher:__ (_noun_). An entity that sends notifications of Changes to a
Topic.

__Originating Publisher:__ (_noun_). The Publisher entity that owns a Topic.
They are the originating source and the only system that authors changes to
the topic.

__To publish:__ (_verb_). The process of notfying subscribers of changes to a
Topic. The originating Publisher MUST _publish_ the Topic using the Relay
specification. Other systems MAY also re-_publish_ the Topic, in which case
they are acting as a Hub.

__Subscriber:__ (_noun_). An entity that receives notifications of changes to
a Topic.

__To subscribe:__ (_verb_). The process of requesing a Publisher publishes to
a Subsciber on an on going basis. Usuaully initiated by the subscriber.

__Hub:__ An entity that both subscribers to a Topic and publishes it. A Hub
re-publishes a Topic or you could say it relays it.

### General Concepts

All Relay Publishers are thier own Hubs. 

A Publisher follows the same approach to _publishing_ content as a Hub
follows for _distributing_ it. (PuSH uses "Publishing" and "distributing" to
refer to slightly different things but Realy seeks to make them the same
thing).

Hubs subscribe to Publishers or other Hubs.


<br/>
<br/>
<a id="3."></a>
************************************************************************************************************************
3. High-level protocol flow
------------------------------------------------------------------------------------------------------------------------

(This section is non-normative.)

The numbering starts a 4 to align with the section numbering in both this and the PuSH 
specification.

* __[4. Discovery](#4.)__ - A Subscriber discovers a Topic from a Publisher
  and how to subscribe to it.

* __[5. Subscription](#5.)__ - The Subscriber subscribes to the Topic to
  receive notification when it changes.
    * __[5.1. Subscription Request](#5.1.)__ - The Subscriber sends a Subscription 
      Request to a Hub. 
    * __[5.2. Subscription Validation](#5.2.)__ - The Hub validiates the Subscription
      Request.
    * __[5.3. Subscriber Verification](#5.3.)__ - The Hub verifies the intent of the 
      Subscriber.
    * __[5.4. Subscription Renewal](#5.4.)__ - The Hub periodically confirms with the 
      Subscriber to check if the subscription is still required.
    * __[5.5. Subscription Denyal](#5.5.)__ - The Hub informs the Subsriber that the 
      subscription has 
      been denied and is not (or no longer) active.

* __[6. Publishing](#6.)__ - Publishers POST any topic changes to their subscriber(s)
  (which many be Hubs). 

* __[7. Content Distribution](#7.)__ - When Hubs receive
  POSTed Topic changes the POST them on to their subscriber(s), which many also
  be Hubs, so the chain continues until all Hubs and Subscribers are reached.
  (_Publishing and Relay-Publishing are done in an identical way and follow the
  PusH spec part 7_)

* __[8. Handeling Failiures](#8.)__ - Publishers SHOULD stop POSTing to Subscribers
  after an agreed number of retrys fail. Both Publishers and Subscribers SHOULD
  follow the Relay specification for detecting, altering and recovering failed
  subscriptions.

* __[9. Catchup and History](#9.)__ - Publishers SHOULD support one of two mechansims
  to allo Subscribers to catchup or get historical Topic entries. This is usful
  for Subscribers after recovering from a failiure or at the point of initial
  subscription.



<br/>
<br/>
<a id="4."></a>  
************************************************************************************************************************
4. Discovery
------------------------------------------------------------------------------------------------------------------------



#### PuSH Specification

![66](66.png)
> 4\. Discovery

> A potential subscriber initiates discovery by retrieving (GET or HEAD
> request) the topic to which it wants to subscribe. The HTTP [RFC2616]
> response from the publisher MUST include at least one Link Header [RFC5988]
> with rel=hub (a hub link header) as well as exactly one Link Header
> [RFC5988] with rel=self (the self link header). The former MUST indicate the
> exact URL of a PubSubHubbub hub designated by the publisher. If more than
> one URL is specified, it is expected that the publisher pings each of these
> URLs, so the subscriber may subscribe to one or more of these. The latter
> will point to the permanent URL for the resource being polled.

> In the absence of HTTP [RFC2616] Link headers, subscribers MAY fall back to
> other methods to discover the hub(s) and the canonical URI of the topic. If
> the topic is an XML based feed, it MAY use embedded link elements as
> described in Appendix B of Web Linking [RFC5988]. Similarly, for HTML pages,
> it MAY use embedded link elements as described in Appendix A of Web Linking
> [RFC5988]. Finally, publishers MAY also use the Well-Known Uniform Resource
> Identifiers [RFC5785] .host-meta to include the <Linkelement with rel="hub".

![99](99.png)

#### Relay Specification

1. Adhere to the PuSH specification.

2. The the self link header SHOULD be equal to the topic_url (This specification 
   does not address the scenario if it is not).

3. There MAY be more than one hub link header. If so Subscribers MAY
   subscriber to one or more Hub. Subscribing to one is RECOMMENDED and
   Subscribers SHOULD use the first first hub link provided unless
   there is a logical reason not to. Publishes SHOULD put their prefered hub
   earlier in the order of hub link headers.

4. Relay Publishers SHOULD NOT fall back to other methods methods of
   discovery mentioned in the PuSH 0.3 and PuSH 0.4 sepcification.

5. Realy Subscribers MAY OPTIONALLY fall back to alternative methods of
   discovery if they need to support PuSH Topics that use these.


#### Examples (Non-normative)

![Relay_Discovery](Relay_Discovery.png)

![Req](Relay_req.png) Subsriber makes a GET or HEAD request to Publisher for a topic.
    
    HEAD <topic_url> HTTP/1.1
    Host: <hostname.com>

![Res](Relay_res.png) Publisher responds to Subscriber with the latest version of the 
topic and suitable headers

    HTTP/1.1 200 OK
    Content-Type: text/xml; charset=utf-8
    Content-Length: length
    Link: <hub_link_url>; rel=hub, <self_link_url>; rel=self




<br/>
<br/>
************************************************************************************************************************
5. Subscribing and Unsubscribing
------------------------------------------------------------------------------------------------------------------------
<a id="5."></a>


#### PuSH Specification

![66](66.png)
> 5\. Subscribing and Unsubscribing

> Subscribing to a topic URL consists of four parts that may occur immediately 
> in sequence or have a delay.

> * Requesting a subscription using the hub
> * Validating the subscription with the publisher (OPTIONAL)
> * Confirming the subscription was actually desired by the subscriber
> * Periodically reconfirming the subscription is still active (OPTIONAL)

> Unsubscribing works in the same way, except with a single parameter changed 
> to indicate the desire to unsubscribe. Also, the Hub will not validate 
> unsubscription requests with the publisher.

![99](99.png)

#### Relay Specification

1. Adhere to the PuSH specification.

2. Sections 5.1, 5.2, 5.3 and 5.4 of the Relay specification map to the four
bullets in section 5 of the PuSH specification. Sections 5.1, 5.2, 5.3 related
to sections of the same numbers in the PuSH specification. Section 5.4
describes subscription renewal / reconfirmation, which is mentioned in various
places in the PuSH specification. Section 5.5 describes subscription denying,
wich is refered to in section 5.2 of the PuSH specification.

4. Each step request the previous step is succesful and in this process the
   Subscriber is given  a number of `lease_seconds` and MUST resubscribe before
   these have elapsed.



. If the Subscriber is a Hub itself it
SHOULD make this known at the time of subscribtion. (_An extension to the PuSH
spec, see below.)



<br/>
<br/>
<a id="5.1."></a>
************************************************************************************************************************
### 5.1. Subscription Request


_The Subscriber sends a Subscription Request to a Publisher_

#### PuSH Specification

![66](66.png)
> 5.1\.  Subscriber Sends Subscription Request
>
> Subscription is initiated by the subscriber making an HTTPS [RFC2616] or
> HTTP [RFC2616] POST request to the hub URL. This request has a Content-Type
> of application/x-www-form-urlencoded (described in Section 17.13.4 of
> [W3C.REC‑html401‑19991224]) and the following parameters in its body:
>
> * __hub.callback__ REQUIRED. The subscriber's callback URL where
>   notifications should be delivered. It is considered good practice to use a
>   unique callback URL for each subscription.
> * __hub.mode__ REQUIRED. The literal string "subscribe" or "unsubscribe",
>   depending on the goal of the request.
> * __hub.topic__ REQUIRED. The topic URL that the subscriber wishes to
>   subscribe to or unsubscribe from.
> * __hub.lease_seconds__ OPTIONAL. Number of seconds for which the subscriber
>   would like to have the subscription active. Hubs MAY choose to respect
>   this value or not, depending on their own policies. This parameter MAY be
>   present for unsubscription requests and MUST be ignored by the hub in that
>   case.
> * __hub.secret__ OPTIONAL. A subscriber-provided secret string that will be
>   used to compute an HMAC digest for authorized content distribution. If not
>   supplied, the HMAC digest will not be present for content distribution
>   requests. This parameter SHOULD only be specified when the request was
>   made over HTTPS [RFC2818]. This parameter MUST be less than 200 bytes in
>   length.
>
> Subscribers MAY also include additional HTTP [RFC2616] request parameters, as
> well as HTTP [RFC2616] Headers if they are required by the hub. In the
> context of social web applications, it is considered good practice to include
> a From HTTP [RFC2616] header (as described in section 14.22 of Hypertext
> Transfer Protocol [RFC2616]) to indicate on behalf of which user the
> subscription is being performed.
> 
> Hubs MUST ignore additional request parameters they do not understand.
>
> Hubs MUST allow subscribers to re-request subscriptions that are already
> activated. Each subsequent request to a hub to subscribe or unsubscribe MUST
> override the previous subscription state for a specific topic URL and
> callback URL combination once the action is verified. Any failures to
> confirm the subscription action MUST leave the subscription state unchanged.
> This is required so subscribers can renew their subscriptions before the
> lease seconds period is over without any interruption.
>
> 5.1.1.  Subscription Parameter Details
> 
> The topic and callback URLs MAY use HTTP [RFC2616] or HTTPS [RFC2818]
> schemes. The topic URL MUST be the one advertised by the publisher in a Self
> Link Header during the discovery phase. (See Section 4). Hubs MAY refuse
> subscriptions if the topic URL does not correspond to the one advertised by
> the publisher. The topic URL can otherwise be free-form following the URI
> spec [RFC3986]. Hubs MUST always decode non-reserved characters for these
> URL parameters; see section 2.4 on "When to Encode or Decode" in the URI
> spec [RFC3986].
>
> The callback URL MAY contain arbitrary query string parameters (e.g.,
> ?foo=bar&red=fish). Hubs MUST preserve the query string during subscription
> verification by appending new parameters to the end of the list using the &
> (ampersand) character to join. Existing parameters with names that overlap
> with those used by verification requests will not be overwritten. For event
> notification, the callback URL will be POSTed to including any query-string
> parameters in the URL portion of the request, not as POST body parameters.
>
> 5.1.2.  Subscription Response Details
>
> The hub MUST respond to a subscription request with an HTTP [RFC2616] 202
> "Accepted" response to indicate that the request was received and will now
> be verified (Section 5.3) and validated (Section 5.2) by the hub. The hub
> SHOULD perform the verification and validation of intent as soon as
> possible.
>
> If a hub finds any errors in the subscription request, an appropriate HTTP
> [RFC2616] error response code (4xx or 5xx) MUST be returned. In the event of
> an error, hubs SHOULD return a description of the error in the response body
> as plain text. Hubs MAY decide to reject some callback URLs or topic URLs
> based on their own policies (e.g., domain authorization, topic URL port
> numbers).

![99](99.png)

#### Relay Specification

(Identical to the PuSH specification.)


#### Examples

![Relay_Subscribe](Relay_Subscribe.png)

![Req](Relay_req.png) Subsriber makes a POST request to the Publisher's hub URL.

    POST <subscriber_callback_url> HTTP/1.1
    Content-Type: application/x-www-form-urlencoded

    hub.callback=http%3A%2F%2Fcallback&hub.mode=subscribe&hub.topic=
      http%3A%2F%2Ftopic&hub.lease_seconds=604800&hub.secret=abc123

![Res](Relay_res.png) Publisher response (success):

    HTTP/1.1 202 Accepted

![Res](Relay_res.png) Publisher response (failiure):

    HTTP/1.1 400 Bad Request

This is an example and error codes could be any 4xx or 5xx.



<br/>
<br/>
<a id="5.2."></a>
************************************************************************************************************************
### 5.2. Subscription Validation 

_The Publisher validiates the Subscription Request_

#### PuSH Specification

![66](66.png) 

> 5.2.  Subscription Validation

> Subscriptions MAY be validated by the Hubs who may require more details to
> accept or refuse a subscription. The Hub MAY also check with the publisher
> whether the subscription should be accepted.

> If (and when), the subscription is accepted, the hub MUST perform the
> verification of intent of the subscriber.

> If (and when), the subscription is denied, the hub MUST inform the
> subscriber by sending an HTTP [RFC2616] GET request to the subscriber's
> callback URL as given in the subscription request. This request has the
> following query string arguments appended (format described in Section
> 17.13.4 of [W3C.REC‑html401‑19991224]):

> * __hub.mode__ REQUIRED. The literal string "denied".
> * __hub.topic__ REQUIRED. The topic URL given in the corresponding 
>   subscription request.
> * __hub.reason__ OPTIONAL. The hub may include a reason for which the 
>   subscription has been denied.

> Hubs may provide an additional HTTP [RFC2616] Location header (as described
> in section 14.30 of Hypertext Transfer Protocol [RFC2616]) to indicate that
> the subscriber may retry subscribing to a different hub.topic. This allows
> for limited distribution to specific groups or users in the context of
> social web applications.

> The subscription MAY be denied by the hub at any point (even if it was
> previously accepted). The Subscriber SHOULD then consider that the
> subscription is not possible anymore.

![99](99.png)

#### Relay Specification

(Meets the PuSH Specification)


#### Examples

![Relay_Validate](Relay_Validate.png)

If validation fails the hub MUST inform the subscriber that the subscription
has been denined. See section 5.4.




<br/>
<br/>
<a id="5.3."></a>
************************************************************************************************************************
### 5.3. Subscriber Verification

_The Publisher verifies the intent of the Subscriber_

#### PuSH Specification

![66](66.png)
> 5.3.  Hub Verifies Intent of the Subscriber

> In order to prevent an attacker from creating unwanted subscriptions on
> behalf of a subscriber (or unsubscribing desired ones), a hub must ensure
> that the subscriber did indeed send the subscription request.

> The hub verifies a subscription request by sending an HTTP [RFC2616] GET
> request to the subscriber's callback URL as given in the subscription
> request. This request has the following query string arguments appended
> (format described in Section 17.13.4 of [W3C.REC‑html401‑19991224]):

> * __hub.mode__ REQUIRED. The literal string "subscribe" or "unsubscribe",
>   which matches the original request to the hub from the subscriber.
> * __hub.topic__ REQUIRED. The topic URL given in the corresponding subscription
>   request.
> * __hub.challenge__ REQUIRED. A hub-generated, random string that MUST be echoed
>   by the subscriber to verify the subscription.
> * __hub.lease_seconds__ REQUIRED/OPTIONAL. The hub-determined number of seconds
>   that the subscription will stay active before expiring, measured from the
>   time the verification request was made from the hub to the subscriber. Hubs
>   MUST supply this parameter for subscription requests. This parameter MAY be
>   present for unsubscribe requests and MUST be ignored by subscribers during
>   unsubscription.

> 5.3.1.  Verification Details

> The subscriber MUST confirm that the hub.topic corresponds to a pending
> subscription or unsubscription that it wishes to carry out. If so, the
> subscriber MUST respond with an HTTP success (2xx) code with a response body
> equal to the hub.challenge parameter. If the subscriber does not agree with
> the action, the subscriber MUST respond with a 404 "Not Found" response.

> The hub MUST consider other server response codes (3xx, 4xx, 5xx) to mean
> that the verification request has failed. If the subscriber returns an HTTP
> [RFC2616] success (2xx) but the content body does not match the
> hub.challenge parameter, the hub MUST also consider verification to have
> failed.

> Hubs MAY make the hub.lease_seconds equal to the value the subscriber passed
> in their subscription request but MAY change the value depending on the
> hub's policies. To sustain a subscription, the subscriber MUST re-request
> the subscription on the hub before hub.lease_seconds seconds has elapsed.

![99](99.png)


(Meets the PuSH Specification)

![Relay_Verify](Relay_Verify.png)

![Req](Relay_req.png) Hub makes a GET request to the Subscribers's callback URL.

    GET <subscriber_callback_url>?hub.mode=subscribe&hub.topic=<topic_url>&hub
      .challenge=<challenge_string>&hub.lease_seconds=604800 HTTP/1.1

![Res](Relay_res.png) Subscriber response (success):

    HTTP/1.1 200 OK

    <challenge_string>

![Res](Relay_res.png) Subscriber response (failiure):

    HTTP/1.1 404 Not Found



<br/>
<br/>
<a id="5.4."></a>
************************************************************************************************************************
### 5.4. Subscription Renewal



<br/>
<br/>
<a id="5.5."></a>
************************************************************************************************************************
### 5.5. Subscription Denyal

_Hub informs the Subscriber when a subscription is denied_

(Meets the PuSH Specification, see PuSH section 5.2)

![Relay_Verify](Relay_Verify.png)

![Req](Relay_req.png) Hub makes a GET request to the Subscribers's callback 
URL.

    GET <subscriber_callback_url>?hub.mode=denied&hub.topic=<topic_url>&hub.
      reason=<reason> HTTP/1.1

![Res](Relay_res.png) Subscriber response:

    HTTP/1.1 200 OK

The specification does not specify what the subscriber response should be. It
SHOULD be assumed the Subscriber can return any response and the Publisher
will ignore it.



<br/>
<br/>
<a id="6."></a>
************************************************************************************************************************
6. Publishing
------------------------------------------------------------------------------------------------------------------------
_The Publisher sends updates to it's Hubs and any other Subscribers_

#### PuSH Specification

![66](66.png)
> 6.  Publishing
>
> The publisher MUST inform the hubs it previously designated when a topic has
> been updated. The hub and the publisher can agree on any mechanism, as long
> as the hub is eventually able send the updated payload to the subscribers.

![99](99.png)

#### Relay Specification

(Meets and Extends the PuSH specification.)
(_Compatible with the PusH spec part 3, 1st bullet.
Different to part 3, 3rd bullet, but that's fine as per part 6_)

![Relay_Publish](Relay_Publish.png)

PuSH leaves it open as to how a Publisher sends content to a Hub. With Relay
Publishers and Hubs both send tehir content to their Subscribers in an
identical way - see Content Distribution.



<br/>
<br/>
<a id="7."></a>
************************************************************************************************************************
7. Content Distribution
------------------------------------------------------------------------------------------------------------------------

_Hub sends updates to Subscribers and any other Hubs_


#### PuSH Specification

![66](66.png) 
> 7.  Content Distribution
>
> A content distribution request is an HTTP [RFC2616] POST request from hub to
> the subscriber's callback URL with the payload of the notification. This
> request MUST have a Content-Type corresponding to the type of the topic. The
> hub MAY reduce the payload to a diff between two consecutive versions if its
> format allows it.
> 
> The request MUST include a Link Header [RFC5988] with rel=hub pointing to
> the Hub as well as a Link Header [RFC5988] with rel=self set to the topic
> that's being updated. The Hub SHOULD combine both headers into a single Link
> Header [RFC5988].
> 
> The successful response from the subscriber's callback URL MUST be an HTTP
> [RFC2616] success (2xx) code. The hub MUST consider all other subscriber
> response codes as failures; that means subscribers MUST NOT use HTTP
> redirects for moving subscriptions. The response body from the subscriber
> MUST be ignored by the hub. Hubs SHOULD retry notifications repeatedly until
> successful (up to some reasonable maximum over a reasonable time period).
> Subscribers SHOULD respond to notifications as quickly as possible; their
> success response code SHOULD only indicate receipt of the message, not
> acknowledgment that it was successfully processed by the subscriber.

![99](99.png)


#### Relay Specification

(Meets and Extends the PuSH specification.)

![Relay_Distribute](Relay_Distribute.png)

Publisher Request:

    POST <subscriber_callback_url> HTTP/1.1
    Content-Type: <topic_content_type>
    Link: <hub_url>; rel=hub, <topic_url>; rel=self

Subscriber Response (sucess):

    HTTP/1.1 200 OK



<br/>
<br/>
<a id="8."></a>
************************************************************************************************************************
8. Authenticated Content Distribution
------------------------------------------------------------------------------------------------------------------------

#### PuSH Specification

![66](66.png) 
> 8.  Authenticated Content Distribution
>
> If the subscriber supplied a value for hub.secret in their subscription
> request, the hub MUST generate an HMAC signature of the payload and include
> that signature in the request headers of the content distribution request.
> The X-Hub-Signature header's value MUST be in the form sha1=signature where
> signature is a 40-byte, hexadecimal representation of a SHA1 signature
> [RFC3174]. The signature MUST be computed using the HMAC algorithm [RFC2104]
> with the request body as the data and the hub.secret as the key.
>
> When subscribers receive a content distribution request with the X-Hub-
> Signature header specified, they SHOULD recompute the SHA1 signature with
> the shared secret using the same method as the hub. If the signature does
> not match, subscribers MUST still return a 2xx success response to
> acknowledge receipt, but locally ignore the message as invalid. Using this
> technique along with HTTPS [RFC2818] for subscription requests enables
> simple subscribers to receive authenticated notifications from hubs without
> the need for subscribers to run an HTTPS [RFC2818] server.
>
> Please note however that this signature only ensures that the payload was
> not forged. Since the notification also includes headers, these should not
> be considered as safe by the subscriber, unless of course the subscriber
> uses HTTPS [RFC2818] callbacks.

![66](66.png) 

#### Relay Specification

TODO


<br/>
<br/>
<a id="9."></a>
************************************************************************************************************************
9. Topic Proxing
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





************************************************************************************************************************

************************************************************************************************************************

************************************************************************************************************************

************************************************************************************************************************

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


References
----------

*[PubSubHubbub Core 0.4 -- Working Draft](https://pubsubhubbub.googlecode.com/git/pubsubhubbub-core-0.4.html)
*RFC4287  Nottingham, M., Ed. and R. Sayre, Ed., [The Atom Syndication Format](http://www.ietf.org/rfc/rfc4287.txt)

