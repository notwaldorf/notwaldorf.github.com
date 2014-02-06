---
layout: post
title: Oops, I accidentally the whole DNS
category: posts
---

Here is my confession, internet: I am writing a cat DNS. That is, a DNS server that resolves everything to cats. You want your email? Cat! You want to check the weather? Cat! It's always cat.

## Wait why?
We were talking at work about DNSes, and it turns out I only *hand wavingly* know how they work. I also like things that troll you. The reason why this post is about what I'm doing and now about what I've done, is because my server isn't done yet. 
Let me try to explain.

* The DNS [spec](http://tools.ietf.org/html/rfc1035) is ridiculous. I genuinely don't want to parse it; It's got a billion fields, it's written in Courier New, and it is really boring. Pros: I have found a nodejs project on github that I'm working from. Cons: it doesn't work for me.
* Testing the DNS server is ridiculous. You take your DNS server for granted, dear reader. I know this, because the moment I set my crappy, barely-running, returning-nothing service as my DNS, a hundred thousand requests started coming in. You see, every service in the universe (gmail, hangouts, apple notifications, bonjour, twitter) polls their mothership every second to check for updates. All these polls come to your server. All you want is to try to go to `www.google.com` in a tab and see what happens. It meeps, that's what happens. MEEP.

## DNS: How do it do it?
You know how DNS works. You give a server a human readable address, like `www.google.com`, and it gives you back the IP address (like `74.125.226.113`) where the thing you are looking for actually lives. Here's pretty much how it goes.

* You type in `www.google.com`.
* This goes to a _root_ nameserver, which doesn't know the IP of your service, but knows the IP of the top level domain you need to speak to (in this case, the .com one). It responds with 'I don't know, but I bet you this other IP does'
* The top level domain server (e.g. the .com one) knows you want something about google, so it will tell you where the google _authoritative_ name server is. 
* The _authoritative_ name server is the best. It knows things without having to ask anyone else. The google authoritative name server is going to give you the IP you want. Bingo bango, sugar in the gas tank.
* My cat DNS server is an _authoritative_ name server, because it knows you want a cat before you even know to ask it for a cat. This also means it should be super simple to implement.

Finally, this is mostly a lie, as in real life all of these servers do a lot of caching. Imagine doing this 3+ step dance every time someone typed `www.google.com` in their browser. IMAGINE. 

## Some code deets
Things communicate with DNS servers over UDP on port 53. A couple of things:

* 53 is a small number for a port, which means it's privileged. Sudo that with care.
* You talk to these servers over UDP. UDP is great because it doesn't have a state, doesn't do any handshakes, offers no guarantees, and is used for sending a small chunk of data. You know what's small? The IP of a cat.

## So
Tune in next week for results on how this actually worked in practice, once I actually get around to writing dem codes.


