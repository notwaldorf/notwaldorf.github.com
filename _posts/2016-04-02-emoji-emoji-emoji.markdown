---
layout: post
title: "Emoji: how do you get from U+1F355 to 🍕?"
category: posts
draft: true
---

You know that scene in The Rock where Nicolas Cage is super dreamy (like he is)
and decides his life mission is to look for VX poison gas and save San Francisco (like he would)?
That's baaaasically me, if by "look for VX poison gas" you mean "nerd out on emoji", and
by "save San Francisco" you mean "and tell everyone about it".
I mean, you clicked on this link, what did you think was going to happen?


<h2>🍿 How did we get so lucky?</h2>

An [emoji](https://en.wikipedia.org/wiki/Emoji) is a coloured glyph. They appeared around 1999 in Japan, where each mobile carrier implemented their own variants, and people
were sending them around in text messages. This was a bit of a mess, as
proprietary formats interacting with other proprietary formats was, so in 2000
there was a proposal to standardize them. It wasn't until 2009, though, that emoji got specced
in Unicode 5.2 <span style="color:#7ccdea;">#blessed</span>.

[Spec](http://unicode.org/reports/tr51/) trivia: each emoji has a [design guideline](http://unicode.org/reports/tr51/#Design_Guidelines)
and name, which is a description/suggestion of what the
emoji should look like. This is why 💁,for example, often gets in trouble for being
labelled as _Information Desk Person_, but is actually just a sassy lady: it's the
implementation of the emoji doesn't match its original description, not the
other way around.

My favourite is 🔂,
_Clockwise Rightwards and Leftwards
Open Circle Arrows With Circled One Overlay_, which shows true dedication to typing.

Emoji does not have a plural in Japanese, so stop trying to make emojis happen.

<h2 style="border-left-color:#fbcd46;">🙀 What is an emoji even</h2>

Every emoji is represented by a `code point` (a hexadecimal number, zero-padded up to at least four digits, like U+26C4).
Each [code point](https://en.wikipedia.org/wiki/Code_point), in turn, can be represented by one or more 16-bit `code unit`.

Some emoji are boring (or in the [basic](https://en.wikipedia.org/wiki/Plane_(Unicode)#Basic_Multilingual_Plane) unicode plane), which means one glyph is represented by one `code unit`.
 ☃ for example is `U+2603` (you'd write this as `\u2603` in the codes). In JavaScript, to find out how many code units represent an emoji, you can query its length:

```
"☃".length    // returns 1
"🐼".length    // returns 2
```

To find out what the code units actually are, you can look them up:

```
"☃".charCodeAt(0).toString(16)    // returns 2603
"🐼".charCodeAt(0).toString(16)    // returns d83d
"🐼".charCodeAt(1).toString(16)    // returns dc3c
```

Let's talk about panda! 🐼 lives in the "astral" plane (it's officially
called a [supplementary](https://en.wikipedia.org/wiki/Plane_(Unicode)#Supplementary_Multilingual_Plane) plane, but that's boring), which means its
code point has more than four digits, and is represented by _two_ code units. This
is called a `surrogate pair`. As we saw above, 🐼 is made up of two
surrogates, `U+D83D` and `U+DC3C`.

<h2 style="border-left-color:#f19fd9;">🙋 What about emoji modifiers?</h2>

🇨🇦 and 👍🏿 and 👨‍👨‍👧‍👧 are also
"astral" plane emojis, only they're made out of 2+ surrogate pairs:

```
"👍🏿".length    // returns 4
"🇨🇦".length    // returns 4
"👨‍👨‍👧‍👧".length    // lol returns 11 (2*4 for each person + 3 connectors)
```

If you type this (in April 2016) in something like Atom (or even Atom's dev tools) though,
you'll notice something weird. Instead of getting a black thumbs up, or the Canadian flag, you get this (I had to highlight the Canadian flag bit, because the glyphs are white):

<img width="129" alt="a yellow thumbs up with a dark brown square; two boxes, each with the letters C and A; 4 separate heads in a line" src="https://cloud.githubusercontent.com/assets/1369170/14193347/def54478-f758-11e5-95ca-bc8b5988874c.png">

Whoaaaa, what's going on there? (This is a trick question. I'ma tell you what's going on there)

The [flags](http://unicode.org/reports/tr51/#Flags) are built around a weird (and annoying to implement) rule: the
surrogate pairs (called `regional indicators`) spell out the country code (so
🇨🇦 is actually `[C][A]`). Skin colours are similar, but a little simpler:
they're made out a special emoji [base](http://unicode.org/reports/tr51/#Subject_Emoji_Modifiers) + one of the 6 special colour [modifiers](http://unicode.org/reports/tr51/#Emoji_Modifiers_Table). The couples/multi
families are a [sequence](http://www.unicode.org/emoji/charts/emoji-zwj-sequences.html) of characters, that together makes one emoji.

<h2 style="border-left-color:#f5db7f;">💰 So what does Chrome do?</h2>
Okay, cool! We figured out what code units we need for 🇨🇦, now, let's figure
out how to render them!

First, Chrome uses a text shaper called [harfbuzz](http://harfbuzz.org/). Text shapers
take Unicode code points and convert them to glyphs -- and guess what we have! Unicode
code points! The text shaper is the one that knows how to look at this stream
of code units and surrogate pairs and figure out which are standalone, which
are weirdo flags, and which are modifiers. Once it's done with it, it comes
up with the glyph and the position where to draw it. If you think about a couple,
👩‍❤️‍👩, all surrogate pairs need to be drawn on
top of each other, so that the spacing around the final glyph adds up.

This glyph and its size/position then goes to [skia](https://en.wikipedia.org/wiki/Skia_Graphics_Engine),
Chrome's graphics engine. It is the one that paints the glyph on the screen.

<h2 style="border-left-color:#e2be78;">🎨 What about fonts?</h2>

Fonts, boy, them's a pickle. There's basically one font per platform that
actually knows how to draw emoji (unless you went out of your way to
install extra ones). All the other fonts just rent the emoji from it.
These fonts are AppleColorEmoji (OSX), Segoe UI Symbol/Emoji (Windows),
NotoColorEmoji (Android) and I don't know what Linux does, but it's probably
black and white. I'm going to keep talking about the Apple one, because that's
the code path I worked on in Chrome, but Windows works very similarly.

So let's say you have this:

```html
<p style="font-family: 'Comic Sans MS', sans-serif;">😻</p>
```

Skia will first look up the glyph corresponding to 😻 in the Comic Sans font.
It won't find it, so it will first try the web `fallback` font, the default
platform sans-serif (I think on OSX this is Helvetica, and it's probably
Arial on Windows). That also doesn't have the glyph (remember, only one font
knows how to draw cats with heart eyes), so Skia will know to fallback to
`AppleColorEmoji` by looking at the glyph: it's 32 bits, and it's in colour,
so it must be an emoji. [Here](https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/platform/fonts/mac/FontCacheMac.mm&q=fontcachemac&sq=package:chromium&type=cs&l=91)'s the code
where that happens.

Cool, so now Skia knows to ask AppleColorEmoji for the cat, and paints it
in the right position, and everything is fine. Cool cool cool.

Remember though how in Atom, you see <img width="53" alt="a yellow thumbs up with a dark brown square" style="display:inline-block;" src="https://cloud.githubusercontent.com/assets/1369170/14195194/5704b2a2-f76b-11e5-922c-d4753861d55f.png">
 instead? What's up with that?
Atom is built on Chromium soooo it should work, right?

Well as we know, software. This fallback logic I just mentioned was a bit
broken pre Chrome 50 for flags and modifiers and complicated emoji like that.
So Harfbuzz got as far as figuring out that there were two different glyphs,
"thumbs up" and "skin colour", but not how to get the correct glyph and draw
them on top of each other. So that's why you get them separately. That's
been fixed now! Yay!


<h2 style="border-left-color:#ed2f20;">💥🙌✨</h2>

Congratulations! Now you too can be Nicolas Cage and shout at people about emoji trivia! Wasn't this fun?
