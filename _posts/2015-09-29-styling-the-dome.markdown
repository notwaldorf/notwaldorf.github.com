---
layout: post
title: "Styling the Shadow DOM or: a metaphor gone too far"
category: posts
---

One of the beefs (and there aren't many) that I have with CSS is that it has a very weak
opinion about style encapsulation. That opinion is basically "well, name your classes well" or else bad
things happen. Know this: I come from C++, land of rules and disappointed compilers; this hand waviness drives me crazy.

This matters because now you have to trust the people that write your css libraries
to have common sense. If my website needs two kinds of fancy buttons, which live in  `shiny-button.css` and `bouncy-button.css`, which are both libraries
written by silly people who want me to use the `.button` class to get their style,
I'm hosed.

## Enter the Shadow DOM
The [Shadow DOM](http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom-201/) fixes this problem by building a little castle (a dome, get it?) around each custom element, locking in its implementation and styles. This is a proper castle, with a proper moat, so now styles can't get in and out of it. This means that if `<shiny-button>` was a custom element instead of a pile of CSS, its `.button` class was scoped to the element itself, and wouldn't stomp over `<bouncy-button>`'s similarly creatively named `.button` class.

This shouldn't surprise you too much, as native elements have been doing this in secret for yeaaaaars. `<input type=date>` styles the date picker somehow, but you've never worried what class names it might use to do so. You know why? Because you can't get to its castle, that's why.

## The struggle is real
So what happens if you _do_ want to style `<shiny-button>`? What if it's a perfectly
respectable button, but it uses Helvetica as its font and you really need it to be Comic Sans because Helvetica is _so_ 2014?

You can always style the _host_ of the element. Think of the host as the castle walls; it's the thing that holds all the actual contents of the custom element. It still plays by CSS rules, so some of the styles you set on the _host_ could
actually trickle down to some child elements. For example:

```css
shiny-button {
  color: white;
  background-color: tomato;
  border-radius: 3px;
  width: 400px;
  /* this will apply to any text in the button,
   * unless a specific child overrides it */
  font-size: 14px;
}
```

What you don't get to do is peek at the implementation of the `<shiny-button>` and decide you don't need one of the nested
`div`s it uses. Again, these are the same rules that `<input type=date>` plays by: you can change the `input`'s text to be red, but that date picker is what it is (hella ugly).

When the Shadow DOM was first introduced, people anticipated this styling problem and took the "bring an AK-47 to a knife fight" approach by giving every developer [dragons](http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom-201/#toc-style-cat-hat). These dragons are called `/deep/` and `::shadow`, and let you cross the moat and tear the shit out of any castle. You
could style anything you wanted in your custom element, because ain't nobody stopping
dragons. It's like that moat isn't even there:

```css
shiny-button /deep/ fancy-div.fancy-class > .button {
  color: red;
}
```

However, as we know from Game of Thrones, you eventually discover that if you have a dragon, it's going to start eating all your goats and people will regret giving you a dragon.

So we deprecated `/deep/` and `::shadow` and web developers around the world panicked.

## Bridges instead of dragons
The correct answer to "say, how do I cross this moat?" isn't "lol a dragon".
It's a bridge. We've been using bridges to cross waters for like 3000 years. Dragons aren't even real, man.

CSS variables (aka custom properties) do exactly that. They're hooks that the developer of a `<shiny-button>` has left all over the code,
so that you can change that particular style. Now you, as the user of a custom element no
longer need to know _how_ that element is implemented. You are given the list of things you can style, and you're set.

The code examples use Polymer, which is what I work on, and what I use to write custom elements. The full code, if you want to play along, is [here](http://jsbin.com/qubila/edit?html,output) (there's an embedded JSBin at the bottom of this post, but you know, spoilers).

## First, a shiny button
So, here's our button. It has a bunch of nested silly things, because why not. Who knows how the native `<input>` actually looks like. Maybe it's `divs` all the way down. Maybe it's spiders. It's probably spiders.

Everything inside `.container`, including `.container` itself is inside the Shadow Castle, so it can't be reached:

```html
<dom-module id="shiny-button">
  <template>
    <style>
      :host      { display: inline-block; color: white;}
      .container { background-color: cornflowerblue; border-radius: 10px; }
      .icon      { font-size: 20px; }
      .text-in-the-shadow-dom { font-weight: 900; }
    </style>
    <div class="container">
      <span class="icon">♡</span>
      <span class="user-text"><content></content></span>
      <span class="text-in-the-shadow-dom">!!!</span>
    </div>
  </template>
  <script>
    Polymer({ is: 'shiny-button' });
  </script>
</dom-module>
...
<!-- somewhere in an index.html, you'd use it like so: -->
<shiny-button>hallo hai</shiny-button>
```
The `<shiny-button`> looks like the thing on the left. Pretty meh. We'll do better. We'll style it
to be the thing on the right, without any 🐲🐲🐲.

<img width="312" alt="screen shot 2015-08-11 at 3 34 51 pm" src="https://cloud.githubusercontent.com/assets/1369170/9212530/97d07e7c-403e-11e5-867e-656ee1fd3cb7.png">

## What can you style right now?
We can only style the _host_ of the element -- this is everything outside the `.container` class, but inside
the shiny button. You know, the walls of the castle.

```css
shiny-button.fancy {
  font-family: "Lato";
  font-weight: 300;
  color: black;
}
```

To see the difference between the host and the container, we can give the button itself a different
background than the `.container`. The red corners you see are part of the host; the blue parts are
the `.container`.

<img width="142" alt="screen shot 2015-08-11 at 3 23 20 pm" src="https://cloud.githubusercontent.com/assets/1369170/9212326/ed035506-403c-11e5-848a-9b35bbdc8fce.png">

Of course, none of these styles will work, because these `divs` are well inside the castle:

```css
shiny-button.fancy .container {
  color: red;
  background-color: pink;
}
shiny-button.fancy .text-in-the-shadow-dom {
  font-weight: 300;
}
```

## And now: some bridges
We probably want to change the button's background color, so we'll create a variable for it, called `--shiny-button-background`. Some things:

  * every Polymer custom property needs to start with a `--`, so that Polymer knows you're not just typing gibberish.
  * I like to include the element name as a prefix to the custom property; I find it useful to remind me what I'm actually styling.
  * I also like documenting these somewhere in a giant docs blurb, so that the element's users know what to expect. Polymer's [paper-checkbox](https://github.com/PolymerElements/paper-checkbox/blob/master/paper-checkbox.html#L34) is a nice example of this (because I wrote it, obvs).

Now that we know a custom property is available, this is how we would use it, inside the custom element:

```css
.container {
  /* cornflowerblue is a default colour, in case the user doesn't
   * provide one. You could omit it if it's being inherited from above */
  background-color: var(--shiny-button-background, cornflowerblue);
}
```
You can think of `var` like an eval, which says "apply the value of this custom property, whatever that value is". And this is how you, the user of the element would actually give it a value:

```css
shiny-button.fancy {
  /* see how much this looks like a normal css property? i.e.
  background: #E91E63; */
  --shiny-button-background: #E91E63;
}
```
<br>

You can add all sorts of hooks for these kinds of "one-off" custom properties. Eventually you will realize that if the thing that should be styled is too generic (the background container of the button) there's waaaaay too many CSS properties to expose one by one. In that case, you can use a _mixin_, which is like a bag of properties that should all be applied at once. By default this bag is empty, so nothing gets applied when defining the custom element:

```css
.icon {
    font-size: 20px;
    @apply(--shiny-button-icon);
  }
```

But the user of the element could start adding things to the bag like this:

```css
shiny-button.fancy {
  font-family: "Lato";
  font-weight: 300;
  color: black;
  --shiny-button-background: #E91E63;

  /* this is the mixin! the colon and the semicolon are both important */
  --shiny-button-icon: {
    color: red;
    padding: 10px;
    text-shadow: 0 1px 1px #880E4F;
  };
}
```
<br>
Some tips:

  * the mixin is only relevant to the selector it's being applied to (modulo CSS inheritance rules). As an element author
  it's your responsability to name this mixin in a way that conveys this. In the example above, `--shiny-button-icon`
  implies you're styling the icon of the button. If instead you're applying that style to the text, for example,
  you're being a bad element author, and your users will shame you on social media.
  * mixins aren't a panacea. If you look at the [paper-checkbox](https://github.com/PolymerElements/paper-checkbox/blob/master/paper-checkbox.html#L34)
  example I mentioned before, you'll notice no mixins at all! This is because the element is fairly restricting, and
  there's only so many things you can possibly care about styling. That's when I tend to prefer individual custom properties vs a mixin.

That's it, that's all! We can style ALL the things now, AND get style encapsulation,
and not sacrifice any goats to dragons. Aren't web components amazing? (Yes they are).

<br>

Here's the JSBin if you want to play with it:
<a class="jsbin-embed" href="http://jsbin.com/qubila/embed?html,output">JS Bin on jsbin.com</a><script src="http://static.jsbin.com/js/embed.min.js?3.34.2"></script>

# Hear me talk about this
I gave this talk at the Polymer [summit](https://www.polymer-project.org/summit). Hurray, the metaphor is spreading!

## Video
<iframe width="560" height="315" src="https://www.youtube.com/embed/IbOaJwqLgog" frameborder="0" allowfullscreen></iframe>

## Slides
<script async class="speakerdeck-embed" data-id="9c0e7a1b528a4293b63e09f1e3c04044" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>
