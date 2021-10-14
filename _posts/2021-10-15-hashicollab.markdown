---
layout: post
title: "A HashiConf art collab"
category: posts
draft: true
---
<style>
.floatie-bit {
  display: flex;
  flex-direction: row;
}
.floatie-bit > p { margin: auto; padding-left: 24px;}
.floatie-bit > img {
  width: 35%;
  flex-shrink: 0;
  vertical-align: middle;
  border-radius: 10px;
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
  border-radius: 10px;
}

@media (max-width: 700px) {
  .floatie-bit {
    flex-direction: column-reverse;
  }
  .floatie-bit > img {
    width: 80%;
  }
  .floatie-bit > .img-column {
    flex-direction: column;
    width: 100%;
    margin-top: var(--spacing-s);
    align-items: center;
  }
  .floatie-bit > .img-column > img {
    width: 80%;
    padding-top: var(--spacing-s);
  }
}
</style>

A couple of months ago my friend [Jana](https://twitter.com/janaboruta) organized [HashiConf Europe](https://hashiconf.com/europe/), and asked me to work on generating custom artwork for each of their speakers. This was my first experience with creating art for someone else, and especially art that had to match someone else’s artistic guidelines. I’ve said this before, but I live and nap by the idea that rules (and editing) are at the core of the artistic process and not having to do that myself was <span class="hilite">brilliant</span>. I wanted to write a bit about it because a) I did a bunch of work that I'm really proud of and I never got to talk about it and b) I am vain and I want to talk about it.

This was the final poster:

<div class="blockquote">
<img alt="a poster for a person named minnie mouse that consists of a grid of triangles and letters in the name, and then in the bottom part of the poster, the name minnie mouse in a big font, with a hashiconf europe footer"
  src="/images/hashicollab/final_poster.webp">
</div>
And this is what we wrote about it on the card that accompanied it:

> Enclosed you will find an art print made for you by generative artist and engineer Monica Dinculescu. <br><br>
> This individual print is unique to you and you alone, as Monica has incorporated your name, the title of your talk, and the color of the HashiCorp product that you are talking about at this year’s conference.<br><br>
> Each cell in the grid has been randomly generated to contain either a letter from your name, or a pattern in the product color. <br><br>
> Cells located towards the middle of the grid are more likely to contain a letter rather than a pattern, and this likelihood decreases in the cells towards the edges. <br><br>
> This print is the only iteration of its kind. Were it to be generated again, it would look slightly different each time.

<br><br>
I print everything in my [art store](https://www.meownica.studio/) myself, because I sell very limited editions and third-party printing companies only make sense financially when you're printing in the several dozen. This does mean that sometimes I’ll fight with my printer thinking that its colour profile is whack, only to discover that it was Doing Just Fine™️ and my MacBook oversaturates things like it's an Instagram filter in 2011. Every day is a school day.

Here are all the prints drying on their totes profesh drying rack that is definitely not just a string I hung around in my office.

<img alt="a photo of a bunch of posters drying, each poster hanging off a string with a paper clip" 
  src="/images/hashicollab/drying.webp">

So, how did we get here?

## v1: I have no idea what you want
The design team’s requirements were clear and wonderful:
- follow the conference guidelines: there is a set of product colours that can be used in very specific ways (either as a solid colour, a gradient, a grid of dots, hashed lines, and nothing else) and should be used to have a geometric grid feeling.
- the art should be unique and somewhat meaningful to the speaker. Like, random shapes might look beautiful, but they have no immediate connection to the speaker or what they were talking about, and needing to explain it too hard takes away from the magic of someone making you your very own art.

<br>
When I think of geometric posters, I (and everyone who's ever looked at a design book) think of [Bauhaus](https://mymodernmet.com/what-is-bauhaus-art-movement/), and that’s exactly where I started. Here's some iterations from this round:

<br>
<div class="floatie-bit">
  <img alt="a grid of randomly rotated quarter circles" src="/images/hashicollab/v1_1.webp">
  <p>Too Partridge-Family: I started with a basic Bauhausy sort of grid, but we felt that it looked too much like a grid of birds. Not all was lost, though; you can see this in a different style on the home page now!
</p>
</div>
<hr>
<div class="floatie-bit">
  <img alt="a grid of squares, some of which are subdivided recursively up to a depth of 3" src="/images/hashicollab/v1_2.webp">
  <p>Extremely Mondrian-y, divided grid of squares. Really boring.
</p>
</div>
<hr>
<div class="floatie-bit">
  <img alt="a grid of randomly rotated quarter circle arcs" src="/images/hashicollab/v1_3.webp">
  <p>Random paths on a grid. These are called <a href="https://en.wikipedia.org/wiki/Truchet_tiles">Truchet tiles</a>, and they're a pretty classic generative art approach. I thought this looked really cool by itself, but it didn’t have a ton of connection with the speaker so we scraped them early on.
</p>
</div>
<hr>
<div class="floatie-bit">
  <img alt="a grid of random shapes (rectangles, squares, circles, lines) randomly positioned" src="/images/hashicollab/v1_5.webp" src="/images/hashicollab/v1_4.webp">
  <p>Random shapes in random places. Too generic, kinda boring.
</p>
</div>
<hr>
<div class="floatie-bit">
  <img alt="a grid of mostly rectangles, a couple of lines and a triangle that are mostly positioned towards the top right corner">
  <p>Random shapes in random places but channeling <a href="https://en.wikipedia.org/wiki/Suprematism">Suprematism</a>. I LOVE this style and I would LOVE to use it again, and I very well might.
</p>
</div>
<hr>
<div class="floatie-bit">
  <img alt="a grid of squares and some letters positioned randomly, sometimes overlapped by one of the squares. nothing is readable." src="/images/hashicollab/v1_6.webp">
  <p>Grid of squares with some overlapped letters. This was one we liked because it had both a grid and the speaker's name, but it felt a bit too chaotic in this iteration. It honestly looks to me like I sneazed a bunch of letters on a grid.
</p>
</div>
<hr>

At this point I also considered some data-based art, but I didn't have enough interesting data that I could aggregate based on a name and an abstract alone. Anyway, did you notice how a lot of the iterations in this bunch are fairly standard generative-art approaches? Like, nothing here was novel, and I intended it that way: I wanted to figure out what the team had in mind, and the only way I knew how to do that was to use some common language we all knew, which is "things we've seen before".

## v2: Grids of letters
What came out from the previous explorations was that they liked the letter grid the most, but not as it was.At this point I also learnt that a specific colour (like, blue) is associated with a particular product (in blue's case that product is [Vagrant](https://www.vagrantup.com/)) that a speaker is giving a talk about. Each of these products have a primary and a slightly lighter secondary colour, which is why below you'll see I stopped mixing different product colours together.

<hr>
<div class="floatie-bit">
  <img alt="a grid of hatched squares or circles, some of which are subdivided recursively up to a depth of 3.sometimes there's a hatched circle that overlaps a subdivided cell" src="/images/hashicollab/v2_6.webp">
  <p>Can we do something with that Mondrian-y grid, but make it less boring with textures? Answer: yes but not in a good way.
</p>
</div>
<hr>
<div class="floatie-bit">
  <img alt="a name in the center of the image overlapping randomly positioned rectangles and squares, which are hatched" src="/images/hashicollab/v2_5.webp">
  <p>Can we do something with those random shapes in random places, but by also remembering the user has a name? Answer: no and let's never mention this horror again.
</p>
</div>
<hr>
<div class="floatie-bit">
  <img alt="a grid of connected blobs, with some of the cells also containing a letter in the name" src="/images/hashicollab/v2_3.webp">
  <p>Enough of that; let's go back to our friend, the grid. Truchet tile blobs with letters. I vetoed this before even sending it over because it was serving very solid 70s lava lamp vibes. At this point I also went a bit mad looking at just Jana's name, so I branched out to another team member.
</p>
</div>
<hr>
<div class="floatie-bit">
  <img alt="a grid of squaares, with some of the cells being a letter in the name" src="/images/hashicollab/v2_1.webp">
  <p>Grids of squares with letters. A bit boring, a bit "not a fan of cutting off letters in principle". This image is really good at showing the letter distribution algorithm that all the grids are using: it's mostly centered around the center horizontal line, and then spreads out randomly outwards and downwards from there.
</p>
</div>
<hr>
<div class="floatie-bit">
  <img alt="a grid of randomly rotated half circles, with some of the cells being a letter in the name" src="/images/hashicollab/v2_2.webp">
  <p>Grids of Bauhaus-style quarter circles or letters. I kind of like this, but overall it still felt a bit too basic and too “classic Bauhaus”.
</p>
</div>
<hr>
<div class="floatie-bit">
  <img alt="a grid of triangles, with some of the cells being a letter in the name" src="/images/hashicollab/v2_4.webp">
  <p>Grids of triangles or letters. This one looks kind of nice, doesn't it? We thought so too.
</p>
</div>
<hr>


You’ll notice that all of these images are very similar looking. This was an extremely good sign for me because I knew we were on the right track, and in the cleaning up stage.

## v3: Bring it home  
We all loved the triangles the most, and in order to make them a bit 🌶 spicy, I decided to vary the texture of the triangle. Remember, I was allowed dots and hatches too! So in the final version, each triangle can be one of the 2 colours belonging to the product, either hashed or filled. Bish, bash, bosh.

From here it was just a matter of designing the poster layout around it, and making sure I had a plan for when my random number pixel math wasn't quuuuuuuite good enough. Thankfully, [dat.gui](https://github.com/dataarts/dat.gui) exists, and this is what I looked at while generating 50-ish posters: 

<img alt="an image of a browser showing one of the randomly generated outputs (the one used in the final poster). to the right there is a control panel containing options such as font size, text offset, box offset, spread, draw text box, etc. the names don't make a ton of sense" src="/images/hashicollab/browser.webp" style="border: 2px solid #F6AFA7; padding: 0;">

## Would I do this again?
<span class="hilite">Absolutely</span>. I honestly loved every step of this. I worked with 3 amazing women from start to finish that had good instincts and were kind and supportive af. I got to think outside of a box I wouldn’t have normally found myself in. I tend to obsessively listen to a new album for 100 hours and I exclusively listened to Jessie Ware for this project (and then, ironically, never again).

Most importantly, I made something that is in 46 humans’ hands. I hope they liked it!!!

I would love to do this again, so if you’re a conference or a company that thinks was a 
cool idea and want to do this with your speakers or employees, hit me up 🙏. I’ve got way more 
ideas where this came from and nothing to do with them.

