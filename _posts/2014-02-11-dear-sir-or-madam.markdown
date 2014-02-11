---
layout: post
title: "Dear sir or madam: the bookmarklet you didn't know you needed"
category: posts
---

Do you sometimes feel the internet is holding you hostage? Don't you wish the internet would _look_ like it's holding you hostage? Worry no more! [Dear-sir-or-madam](https://github.com/notwaldorf/dear-sir-or-madam) is a bookmarklet that makes web pages look like they're ransom notes. For example, like this:

![screenshot](http://i.imgur.com/Hbcj9jE.png)

## How to use
Make a bookmark out of this <a href="javascript:var i,s,ss=['http://notwaldorf.github.io/dear-sir-or-madam/ransom-it.js','http://code.jquery.com/jquery-1.10.1.min.js'];for(i=0;i!=ss.length;i++){s=document.createElement('script');s.src=ss[i];document.body.appendChild(s);}void(0);">link</a>. Or if that doesn't work, create a bookmark and set its url to:

```
javascript:var i,s,ss=['http://notwaldorf.github.io/dear-sir-or-madam/ransom-it.js','http://code.jquery.com/jquery-1.10.1.min.js'];for(i=0;i!=ss.length;i++){s=document.createElement('script');s.src=ss[i];document.body.appendChild(s);}void(0);
```
Then go to a non-https webpage, and hit that bookmarklet. Then, wait a bit. Then, BAM.

## Disclaimers? Disclaimers!
This doesn't work with https websites at the moment (or possibly forever). Also, I wrote the code at 7am, after very little sleep, so you can count on it being high quality. It's not the fastest it can be, but it's definitely not the n^2 abomination I wrote in the first iteration either. 
