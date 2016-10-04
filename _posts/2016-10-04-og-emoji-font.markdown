---
layout: post
title: "I made a 2001-era emoji font! That you can use!"
category: posts
---

You know the scenes in Friends when Ross starts talking about dinosaurs
and he's SUPER excited but everyone else is losing the will to live?
This is basically that, only instead of dinosaurs, it's emoji, and unlike Ross,
I have never successfully befriended a monkey.

Last month, my coworker casually told me he still has a 2001 era DoCoMo phone, which is
one of the first phones to have emoji (🤓🤓🤓: emoji first appeared in 1999, on DoCoMo phones,
and DoCoMo phones alone). So I got ahold of this phone. Which charged, turned on
and most importantly, TOTALLY had OG emoji:

<div style="width:100%">
<img src="/images/2016-09-28/all-1.jpg" width="30%" style="display:inline">
<img src="/images/2016-09-28/all-2.jpg" width="30%" style="display:inline">
<img src="/images/2016-09-28/all-3.jpg" width="30%" style="display:inline">
<br><br><br>
</div>


I spent the whole day being unproductive and sending emoji messages to people:

<div style="width:100%">
<img src="/images/2016-09-28/msg-1.jpg" width="30%" style="display:inline">
<img src="/images/2016-09-28/msg-2.jpg" width="30%" style="display:inline">
<img src="/images/2016-09-28/msg-3.jpg" width="30%" style="display:inline">
</div>

## SVGs

I then took a 10 hour flight to Europe and, for lack of better things to do
while watching every movie that came out this year, I drew every one of those emoji as a sprite.
166 emoji in total, 12x12px each, in one of six colors. This was my first time doing pixels
sprites, so I obviously fucked it up: I ended up with a bunch of random sprite sheets,
each with a random number of sprites in it, which was a bit of a mess. Thankfully,
[Amanda Glosson](https://twitter.com/amandaglosson), reigning queen of pixels, wrote me a script to transmogrify my mess into
individual svgs. **These** individual SVGs, to be exact:

<iframe src="/images/2016-09-28/svgs.html" width="100%"
onload="this.height=this.contentDocument.body.getBoundingClientRect().height + 20"
frameBorder="0"></iframe>

LOOK HOW PRETTY THEY ARE! <span class="og">💓</span>

## A wild font appears
The reason why I made those SVGs was partly because Captain America Civil War is unbearably
boring, but partly because I wanted to make a font and use it everywhere like
an emoji hipster.

So then I did. I used [Fontastic](http://app.fontastic.me/) to make the font -- it's black and white for now,
because I couldn't figure out how to colour the glyphs correctly, but I will soon (if anyone
  knows of an easy way, holla my way). I
also mapped the OG emoji glyph to one of the current existing emoji code points,
based on the list [here](), because let's be honest, some of them were mysterious.
Do you know what <span class="og">💥</span> means? It's 💥. And
<span class="og">💦</span> is 💦. 12 pixels ain't a lot of pixels, friends.

<style>
.emoji-sample {
  font-size: 24px;
  letter-spacing: 6px;
  line-height: 30px !important;
}
</style>

Here the 166 emoji as they look today:
<div>
<p class="emoji-sample">❤💔💓💕😃😖😞😵😠🎵♨💠💋✨💡💢👊💣🎶💤❗⁉‼💥💦💧💨〰️➰⤴⤵↗↘↖↙☀️☁️☔️⛄⚡️🌀🌁🌂♈️♉️♊️♋️♌️♍️♎️♏️♐️♑️♒️♓️🎽⚾️⛳🎾⚽️🎿🏀🏁📟🚃Ⓜ🚄🚗🚙🚌🚢✈️🏠🏢🏣🏥🏦🏧🏨🏪⛽🅿🚥🚻🍴☕🍸🍺🍔👠✂️🎤🎥🎠🎧🎨🎩🎪🎫🚬🚭📷👜📖🎀🎁🎂☎︎📱📝📺🎮💿♥♠♦♣👀👂✊✌️✋👣👟👓🌑🌔🌓🌙🌕🐶🐱⛵🎄📲📩📠✉︎💴🆓🆔↩🆑🔍🆕🚩➿#️⃣0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🆗</p>
</div>

And here's the same list, using the OG DoCoMo emoji font:
<div>
<p class="og emoji-sample">❤💔💓💕😃😖😞😵😠🎵♨💠💋✨💡💢👊💣🎶💤❗⁉‼💥💦💧💨〰️➰⤴⤵↗↘↖↙☀☁︎☔︎⛄⚡︎🌀🌁🌂♈︎♉︎♊︎♋︎♌︎♍︎♎︎♏︎♐︎♑︎♒︎♓︎🎽⚾︎⛳🎾⚽︎🎿🏀🏁📟🚃Ⓜ🚄🚗🚙🚌🚢✈️🏠🏢🏣🏥🏦🏧🏨🏪⛽🅿🚥🚻🍴☕🍸🍺🍔👠✂︎🎤🎥🎠🎧🎨🎩🎪🎫🚬🚭📷👜📖🎀🎁🎂☎︎📱📝📺🎮💿♥♠♦♣👀👂✊✌︎✋👣👟👓🌑🌔🌓🌙🌕🐶🐱⛵🎄📲📩📠✉︎💴🆓🆔↩🆑🔍🆕🚩➿#0123456789🆗</p>
</div>

There's some OG emoji that don't even exist today!:
<p class="og emoji-sample">abcde</p>

<h2>Boom! <span class="og" style="font-weight:normal;">💣</span></h2>

If you want to use it, you can download the font [here](/fonts/og-dcm-emoji.ttf), and use
it as a `font-face`:

```html
@font-face {
  font-family: og-emoji;
  src: url(/fonts/og-dcm-emoji.ttf);
}
.og {
  font-family: og-emoji, sans-serif;
}
<span class='og'>💥</span>
```

If you're going to use it, maybe give me some credit, because I spent an unhealthy
amount of time on it. Also, if you're
DoCoMo, please don't sue me. Emojineering comes only from the <span class="og">❤</span>.

<h1 class="og" style="font-weight:normal;">✌︎ ✨ 🐱 💋 🆗</h1>
