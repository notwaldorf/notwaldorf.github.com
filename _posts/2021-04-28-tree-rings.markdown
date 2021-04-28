---
layout: post
title: "From JavaScript to paper: a linocut adventure"
category: posts
draft: true
---
<style>
.floatie-bit {
  display: flex;
  flex-direction: row;
}
.floatie-bit > p { margin: auto}
.floatie-bit > img {
  width: 35%;
  flex-shrink: 0;
  vertical-align: middle;
}
.floatie-bit > .img-column {
  width: 30%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  margin-right: var(--spacing-s);
} 
.img-column img {
  width: 90%;
  vertical-align: middle;
}

@media (max-width: 700px) {
  .floatie-bit {
    flex-direction: column-reverse;
  }
  .floatie-bit img {
    width: 80%;
  }
}
</style>
One of my favourite kinds of art to make involves taking nature and seeing it as simple shapes. Buildings are cubes, flowers are circles, hills are curves. Shells are spirals. Tree rings are weird circle bois, and they are some of the best. I've wanted to make a generative art of a tree ring for a long time, but everything I made kept sucking (scroll to the bottom if you don't believe me. Shit was bad bad). I finally made something I like, I thought it might be neat to write a little bit about The Process™️, since it involves both JavaScript and murderous little knives. 

# Let's talk trees
My friend [Kyle](http://twitter.com/kneath) has a ranch, and in the summer he lets his friends fulfill the burned out millenial dream of having no cell signal and sleeping in a tent. He has infinitely many trees, and sometimes he lets me do a craft with some of the trees he chops down. I'm "currently" (read: I started last year and I'll probably finish in 2026) making a side table. I also made these coasters:

<img alt="a photo of a small section of a tree ring" src="/images/treerings/coasters.webp">

Trees are rad, yo. Young trees have very regular and evenly spaced rings because much like human children, they haven't had a lot of life to live. However, as trees get older, they get jobs they don't like, have to start making dinner every night, start having back pains from literally just being trees and their rings get wonkier. Here is what I'm making my table from:

<img alt="a photo of a bigger section of a tree ring" src="/images//treerings/table.webp">

Trees can grow unevenly because of droughts or insects or capitalism building shit where it shouldn't. They get visible scars from forest fires. You can map the entire life of a tree (and tbh, of everything that was happening around the tree) by looking at its cross section. There's something called a [ghost forest](https://oceanservice.noaa.gov/facts/ghost-forest.html) that indicates at some point, something happened (like an earthquake), which caused salt water to rise, killing all the trees that lived there. Here's a photo ([ref](https://www.thechiefnews.com/news/tree-rings-tell-physiology-of-drought-intolerance-from-fire-suppression/article_15bdab20-096d-11e9-a7d2-6b0dc38e5dc2.html)) of a knotty tree (heh heh) that has fire scars:

<img alt="a photo of a section of a tree ring that is very elongated and has a lot of
dark blobby spots, that are labelled with years." src="/images//treerings/fire.webp">

So you know, if you want a tree ring, you can't just draw some concentric circles and call it a day.


# Generate some tree rings
Montage time: the Rocky-runs-up-the-stairs song is playing in the background. I am 
hunched over a laptop because I have the posture of a pretzel and the willpower to change that of a golden retriever left alone with a burrito. I am furiously typing for-loops in an editor; my cat is trying to drink from my water glass even though there's a perfectly nice pet bowl of water next to it. I save these files to my computer to document what I think is going to be a cool progression of generated art. It is, in fact, not.

<br>
<div class="floatie-bit">
  <img alt="some close concentric circles, each with jagged edges" src="/images//treerings/1.webp">
  <p>I drew some concentric circles and tried to call it a day. They looked stupid. The circles are kind
  of jaggedy because I didn't even try to use Perlin noise, that's how lazy I was. If you don't know about Perlin noise, <a href="https://varun.ca/noise/">Varun's article</a> is 😘🤌 and fun. As a side</p>
</div>
<hr>
<div class="floatie-bit">
  <img alt="concentric rings of small strokes" src="/images//treerings/2.webp">
  <p>I tried to throw away the circles and just paint their shapes with strokes. This certainly looks interesting, but it doesn't do tree rings justice. Don't worry: I'll end up using these painty-strokes in a different project.</p>
</div>
<hr>
<div class="floatie-bit">
  <img alt="close concentric circles, some of which are overlapped by randomly positioned small strokes" src="/images//treerings/3.webp">
  <p>"What if you keep the rings AND the strokes but you randomize them more". 
  <br><br>
  No.</p>
</div>
<hr>
<div class="floatie-bit">
  <img alt="small concentric circles like in the first image, but with some black triangles" src="/images//treerings/4.webp">
    <p>"Maybe go back to the first circles and add some cracks. Maybe that's what's missing".
    <br><br>
    Narrator: it was not. So this definitely looks like a tree ring! But it also 100% looks like a for-loop generated it and that is not a thing I'm sticking my name on.</p>
</div>
<hr>
<div class="floatie-bit">
  <img alt="smoother concentric circles, of different thicknesses and greyscale colours, with some black lines overlapping" src="/images//treerings/5.webp">
  <p>"Perlin noise. Didn't I say Perlin noise fixes everything? This will fix everything".
  <br><br>
  Better, but it still looks like someone in CS-101 drew it, let's be honest.</p>
</div>
<hr>
<div class="floatie-bit">
  <img alt="smoother concentric circles, of different thicknesses and greyscale colours, with some black lines overlapping. they are pretty regular towards the center, but much wobblier towards the outermost circle" src="/images//treerings/6.webp">
  <p>Play with the noise parameter, making the outer rings noisier than the inner ones. Don't 
  play with it too much though or it will steer rapidly into drippy Dali clock territory.
  <br><br>
  This was okay. The shape looked like a believable tree ring; it was just kind of...boring.</p>
</div>
<hr>

This, dear reader, is where I realised this wasn't going to end well, and here's why: after all these
explorations I had a fairly good idea of what I wanted the tree ring to look like, but I didn't
know how to say it in JavaScript. All of this is drawing pixels and curves in the html canvas, and that shit is hard. I have no idea how to start adding textures and stuff to it, and the point is:
I don't want to learn. For me, that isn't what generative art is about, that's what traditional mediums are about.


# Carve them up
In parallel, I also started carving linocuts. For context, the scene is: March 2021, in the middle of the pandemic. I am bored senseless, and stabbing squishy rubber with a sharp knife sounds like a great way to spend a Saturday. Also, there's something poetic about literally bleeding for your art because as
a very clumsy person you best believe I accidentally (and sadly more than once) jammed a knife in my thumb.

<div class="floatie-bit">
  <div class="img-column">
   <br>
    <img alt="a printout of a wobbly set of tree rings" src="/images//treerings/7.webp">
  </div>
  <p>I started with this generated tree ring. I don't have the digital file anymore because this part went so poorly and made me so mad I probably threw it after a tantrum. I drew some random lines to "represent texture" on the printout and went in with the misplaced attitude of "I'll figure the rest when I carve it", because despite this never working for the last 35 years of my life, it's still something I insist on trying.</p>
</div>

<hr>
<div class="floatie-bit">
  <div class="img-column">
    <img alt="a really bad and messy print of alleged tree rings" src="/images//treerings/8.webp">
    <img alt="an even worse and messy print of alleged tree rings" src="/images//treerings/9.webp">
  </div>
  <p>
  The linocuts and the prints were a mess, and here are some samples. I can't stress this enough, linocutting is not a medium for improvisation. I tried this chaos approach THREE more times,
  as if time was going to help (it didn't). It was truly bad. I'm only showing you this to make you feel better about whatever projects you have in progress and don't feel great about. </p>
</div>
<hr>
<div class="floatie-bit">
  <div class="img-column">
    <img alt="a photo of a bigger section of a tree ring" src="/images//treerings/11.webp">
    <img alt="a photo of a bigger section of a tree ring" src="/images//treerings/12.webp">
  </div>
   <p>I finally took a step back and made a plan, like I should've done in the first place. I imported 
   the generated tree ring in Procreate, drew a bunch of other lines and cracks on it untik it looked right. 
   At this point it looks *very* different than what we started with, but the foundations are all there: the edges and rings have the same shapes, the cracks are mostly in the same places.</p>
</div>
<hr>

What a ride, eh? I'm happy that I did all the generative explorations, because now I have a PILE of JavaScript
I can just pull up whenever I need to: noisy circles, paint strokes, blobby stroke lines. I am also happy that
I ended up finishing this as a linocut: it now feels like the human-for-loop collaboration of my dreams.

I've put up these prints for sale in [my store](https://meownica.studio/product/tree-rings) -- they are all 
hand printed by me, either using black ink on white deckle paper, or with gold ink on a black paper.
<div class="floatie-bit">
  <img alt="a photo of a bigger section of a tree ring" src="/images//treerings/final1.webp">
  <img alt="a photo of a bigger section of a tree ring" src="/images//treerings/final2.webp">
</div>