---
layout: post
title: "Chrome extensions for quick site redesigns"
category: posts
---

There's this thing I hate about the modern web which is that sites are rarely
one giant html file filled with goodies. You can't just "run a site" locally.
You need an `npm` or a `gulp` step or a `docker` if you're lucky. And probably
a local server, but not the one you have installed. Which, I mean,
makes sense, because modern web sites are big and powerful and have complicated
front-ends and _do_ more things than a giant html file would. But
it also kind of sucks because the build ceremonial sacrifices can be a bit overwhelming.
Maybe you just want to see what the links would look like if they didn't have
underlines. Maybe you want to change the fonts. Maybe you're never even
going to ship these changes, you just want to get a feel for them.

Boy, have I got an idea for you: Chrome extensions. Hear me out. A Chrome extension
is a bit of code that runs on a specific page (or set of pages). It can be anything
you want. In particular, it can be a CSS stylesheet.

Then, re-theming a site is just a matter of installing this Chrome extension. If
you want to share it with people, you can just zip it up and send it around.
It's obviously not production ready, but it's amaaaaazing for prototyping.

I made a [glitch](https://glitch.com/edit/#!/chrome-css-extension) project
that gets you started with writing a Chrome extension that injects a CSS stylesheet.
There's only one thing you need to know: this stylesheet is a _User Agent_
stylesheet, which means it has the lowest specificity. So some of its styles
won't get applied unless you slap some `!important`s on it (or have extra
specific selectors). Or, if you have an ID, you can do my favourite CSS hack ever
that I learnt from [Surma](https://twitter.com/dassurma) and will take to the grave:

```css
#foo#foo {
  /* this is a really winner #foo selector */
  color: red;
}
```

<hr>

That's it! If you want to see an example of such an extension in the wild, I made [picasso](https://github.com/notwaldorf/picasso),
which is just a pretty Google Calendar theme. Originally it was just a local
extension I kept on my machine, but eventually I published it because I
realized other people may want to give their calendar a bubble bath. Anyway, happy retheming!
