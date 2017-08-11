---
layout: post
title: "Shadow DOM: fast and encapsulated styles"
category: posts
---

[Shadow DOM](https://developers.google.com/web/fundamentals/getting-started/primers/shadowdom) is a fairly recent-ish spec that gives you DOM tree encapsulation -- it’s one of the superhero lions in the Voltron of specs called “Web Components”. [Web Components](https://www.webcomponents.org/introduction) let you create reusable, self-contained components in JavaScript; the Shadow DOM bit makes sure that the CSS and markup you bundle with your implementation is encapsulated, hiding the implementation details of your element.

The idea of encapsulation isn’t new -- most programming languages have a way to define “private” bits of code -- variables or methods that are irrelevant to the user of that object and make the element work. Messing with them usually voids the contract and breaks the guarantee that the element will continue to work. In these languages you could, instead, use a global variable or method for everything. It’s not a question of whether it will work (it will), but whether it will work over time, in a large code base (it won’t). You know it won’t.

On the web, there’s two kinds of encapsulation we might want: style encapsulation (an element’s styles don’t leak outside) and DOM encapsulation (an element’s internal implementation isn’t visible). This post talks about style encapsulation; tune in soon for the second half of the story -- the DOM encapsulation!

Whew, ok then. So then why is CSS encapsulation so hard? And what’s the fastest way to get it?

<hr>

## Tools to the rescue!

🙏 Before you set me on fire on Twitter, hear this: the next paragraph isn’t a criticism of CSS (which I think is the greatest tool for authoring styles) nor a criticism of the tools we use (which I think fill real gaps we have), but a criticism of the standards process itself.

I have a theory that developers will put up with too much when it comes to writing CSS. For a while there, CSS wasn’t moving forward, so people started using tools to get around that. We didn’t have variables or mixins, so we started using preprocessors. We didn’t have style encapsulation, so we started naming things “the right way” with BEM, so that we didn’t accidentally stomp over each other’s styles. We wanted to be able to author CSS from inside a JavaScript component, so we started using CSS-in-JS. We needed all these tools, because “the platform” (read: the browsers that be) wasn’t there, and building these tools showed that there was a need to move forward. For style encapsulation, Shadow DOM **is** the platform moving forward.

The unsatisfying part of the web is that you don’t have these problems when you build a one page site or app -- you have control over your 17 shades of slightly different blue and your custom build pipeline. But when you have big projects, with weird architectures, targeting different platforms and written across different teams, you end up spending a lot of time just setting up infrastructure and build configurations, which kind of sucks.
## Existing scoping approaches
So now that you (maybe) believe me that style encapsulation is a good thing, let’s talk about the bunch of ways in which you can get various degrees of it. They basically come in two flavours: encapsulation by convention or encapsulation with buy-in. Here they are (in my opinion), from least to most effective:
### 1. Better naming strategies
“_Name your stuff better_” works if you have control over the things you are naming. But if you already do, then you probably don’t need style encapsulation in the first place. You can just...not...do the bad things and the stomping. The problem is that if you’re building a third party widget (say, a fancy date picker that everyone in the universe will have to use), or if you’re building something as part of a large team, you have to be very, very careful not to name it anything that anyone out there might ever call it. Not very scientific.

<p class="chunk">
👍 It’s really easy and doesn’t need tools.<br><br>
👎 It’s really hard if you don’t have tools to enforce it. And doesn’t really work.
</p>

### 2. <iframe>
Ugh, you know it works. Iframes are this special magical portal that teleports any piece of HTML into your piece of HTML, while keeping it wrapped in a safety bubble. But you can’t resize them easily. Or scroll nicely. Or pretend they’re not a teleported piece of code wrapped in a safety bubble. I didn’t even have to doctor this screenshot, it’s real life:

<img alt="google search suggestions for 'iframes are'" src="/images/2017-08-11/iframes.png">

<p class="chunk">
👍 It’s the most encapsulation and abstraction you will ever get on the web.<br><br>
👎 It’s an iframe.
</p>

### 3. CSS modules
[CSS Modules](https://m.alphasights.com/css-evolution-from-css-sass-bem-css-modules-to-styled-components-d4c1da3a659b) are another approach to faking style encapsulation. It’s basically a smart way of automating BEM, so that you don’t have to worry about choosing the unique class names -- there’s a tool that does it for you! It works pretty well, since it prevents any potential name collisions you’ve had with BEM, but at the end of the day, it’s not _actually_ style encapsulation. There’s nothing stopping you from styling any bit of the DOM tree, which means it’s not a very satisfactory answer if you’re in the business of vending, or using, robust third party components.

### 4. CSS-in-JS
[CSS-in-JS](https://medium.freecodecamp.com/css-in-javascript-the-future-of-component-based-styling-70b161a79a32) is a new approach that lets you author CSS literally in JavaScript. Then, this JavaScript is basically transmogrified into a style, which means that that style is sort of encapsulated -- it’s local to that element, and hard to stomp over. There’s several ways to do this, some better than others:

#### Directly setting the style as an attribute

```
someElement.style.marginLeft = ‘20px’
```

This is the worst of all the worlds because the CSS parser can do way fewer optimizations and caching than if you used class names, for example (see [a benchmark](https://twitter.com/notwaldorf/status/859636431974739968)).

#### Embedding CSS style strings in your JS output

Something like `<div style=”...”>` is still pretty terrible for performance. Browsers (or at least Chrome), do a looooooot of string conversions in this case, which means it at least doubles your memory footprint, because the same string has to live both in V8 and Blink. Here’s what happens behind the scenes:

- Take the JS off the wire, in whatever encoding your page is in
- Turn it into whatever encoding V8 prefers, for super optimal memory compactness
- Scan the JavaScript string
- Parse the JavaScript string
- Turn it into an internal string for the DOM when you want to apply the styles
- Potentially re-encode it if you’re unlucky
- Take the internal string, pass it to Blink (string copies ahoy!)
- Blink passes it to the CSS parser, which turns it into styles

#### Compiling out your CSS

Like, into a separate resource, and then applying styles via classes. This works really well, since you’ve used the browser as it wanted to be used. In comparison to the previous case, for a regular `<style>` in a CSS stylesheet, the browser has the same string and just passes it around:

- Take the CSS off the wire into Blink
- Tokenize it
- Build a DOM tree with the string as a text node
- Parse the text node
- Pass it to the CSS parser, which turns it into styles

<p class="chunk">
👍 Managing a giant amount of styles is nice. Style encapsulation is nice. It works extremely well if you’re using a framework that works well with this.<br><br>
👎 There’s <a href="https://github.com/MicheleBertoli/css-in-js">a million</a> ways to do this, and it’s really overwhelming if you are new to it. This approach tends to also be married to a framework, which makes sharing components hard -- both the user and the author of a component need to agree on <b>both</b> the framework and the css-in-js style, which isn’t always possible.
</p>

### 4. Shadow DOM
This is a cheap move: you know this article is about the Shadow DOM, and I left it until the end because I obviously think it’s the best. Shadow DOM was literally built to solve the problem of style and DOM encapsulation. It does the same thing that `<input>` and `<video>` elements have been doing for years (hiding their dirty laundry) but in a way that browsers can optimize around.

The reason for that is that browsers have a special **style resolve** for Shadow DOM trees. Apart from being regular CSS that the browser already knows how to optimize, the CSS inside shadow DOM trees only applies inside that element. This means that changing a class name or style inside of a shadow root won’t affect everything outside it. Since you don’t have to consider the rest of the world, this means style resolution and application is much faster.

The same argument can be made for element authors -- since you know that everything inside of your element can’t leak outside, the implementation is much simpler. You don’t have to think about _the rest_ of the world. You only have to consider your element’s public API, and its implementation.  

Before you complain that using a Shadow DOM and Web Components means that it absolutely requires JavaScript: this is true. But if you’re in a big team, building the kind of big app where you’re looking to style encapsulation as a solution for your CSS bowl of spaghetti, I’m pretty sure you’re already using JavaScript. And the community has been exploring [solutions](https://github.com/skatejs/ssr) to server-side rendering Shadow DOM anyway. Tradeoffs be tradeoffs, and this seems like an easy one.

<p class="chunk">
👍 We’ve been complaining that nothing in CSS was helping with style encapsulation and this is <i>literally</i> the platform’s answer to that problem.<br><br>
👎 Because it’s a new spec, it’s suffering from some growing pains. On older browsers you need a <a href="https://github.com/webcomponents/shadycss">polyfill</a>. If you want reusable elements that are also highly customizable, this style encapsulation might get in the way right now. Thankfully, good people are already working on that. <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/--*">Custom properties</a> are a new spec meant to address this, and the <a href="https://tabatkins.github.io/specs/css-shadow-parts/">new proposal</a> for theming custom elements is now an <a href="https://twitter.com/tabatkins/status/893376459091390464">editor's draft</a>!
</p>

<hr>

The zen of web development is a small page -- reusable components, not a lot of code, no wheels reinvented. Encapsulated styles are better for you as a developer (code can be simpler), and better for you as a platform (code can be faster). And without external tools or iframe nightmares, the only way to get this is Shadow DOM.
