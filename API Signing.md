REST API Signing
----------------

Consider a REST API request. First of all it's going to be using HTTP so each request will include something like this:

    <Method> <Request-URI> HTTP/1.1
    Host: <Host>
    Content-Length: <Content-Length>
    field-name: <field-value>
    field-name: <field-value>
    field-name: <field-value>

    <message-body>

For the server to be sure the client sending this request is legitimate it's common practice for the client to sign it by:

1. Taking specific parts of the request (e.g. those in angle brakets );
2. Potentially adding other data (e.g. the current time)
3. Concatoanting these into a _string_ 
4. Calculating a one way hash of the string to produce a _signature_ (using a secret key which only the client and server share)
5. Puting the signature plus potentially some additional information in a http header (e.g. the Authorization header)
6. Sending the request to the server.

The Server then verifies the request using the same steps 1-4 and then comparing the signature it gets to the one the client has provided. If they don't match somthing is wrong and the server rejects the request.

Different APIs follow variations on this theme so to help  here is a notation to describe an approach.

REST API Signing Notation
=========================

    String-To-Sign-Notation = *(Identifier | string) 
    Identifier     = "<" (reserved-name | field-name) ">"
    string         = token
    reserved-name  = "$" reserved-field
    reserved-field = "Method"
                   | "Request-URI"
                   | "Body"
                   | ""
    field-name     = token

    String-To-Sign-Notation = Identifier *(";" Identifier) 
    Identifier     = "$" reserved-name | header-name
    header-name    = token
    reserved-name  = "$" reserved-field
    reserved-field = "Method"
                   | "Request-URI"
                   | "Body"

For example:

    //if:
    string-to-sign-notation = "$Method;$Request-URI;content-type;host"

    //then:
    string-to-sign = "GET:/path/to/resouce:3000"



Where field-name is the name of any header in the request. 

