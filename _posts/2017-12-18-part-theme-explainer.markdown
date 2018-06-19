---
layout: post
title: "::part and ::theme, an ::explainer"
category: posts
---

(get it? `::` ? I made a funny)

[Shadow DOM](https://meowni.ca/posts/shadow-dom/) is a spec that gives you DOM and style encapsulation. This is great for reusable [web components](https://meowni.ca/posts/web-components-with-otters/), as it reduces the ability of these components' styles getting accidentally stomped over (the old _"I have a class called "button" and you have a class called "button", now we both look busted"_ problem), but it adds a barrier for styling and theming these components deliberately.

Since a lot has changed since the [last time](https://meowni.ca/posts/styling-the-dome/) I talked about styling the Shadow DOM, I wanted to give you a quick update about what new specs were in the works! Please note that this spec **isn't** quite final, which means that a) the syntax and capabilities will likely change and b) there isn't a polyfill you can use for realsies.

<hr>

Ok, so. When talking about styling a component, there are usually two different problems you might want to solve:

**💇 Styling:** I am using a third-party `<fancy-button>` element on my site and I want this one to be blue

**🎨 Theming:** I am using many third-party elements on my site, and some of them have a `<fancy-button>`; I want all the `<fancy-button>`s to be blue.

Here's almost everything I know on this topic.

## A trip through time
There have been several previous attempts at solving this, some more successful than others. If you've read my [last](https://meowni.ca/posts/styling-the-dome/) post about this, you're already caught up. If you haven't, here's the deets:

- First came `:shadow` and `/deep/` (which have since been deprecated, and removed as of Chrome 60). These were shadow-piercing selectors that allowed you to target any node in an element's Shadow DOM. Apart from being terribad for performance, they also required the user of an element to be intimately familiar with some random element's implementation, which was unlikely and lead to them just breaking the whole element by accident

- [Custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) allow you to create custom CSS properties that can be used throughout an app. In particular, they pierce the shadow boundary, which means they can be used for styling elements with a Shadow DOM:
If `<fancy-button>` uses a `--fancy-button-background` property to control its background, then:

  ```css
fancy-button#one { --fancy-button-background: blue; } /* solves the 💇  problem and */
fancy-button { --fancy-button-background: blue; } /* solves the 🎨  problem */
  ```

- The problem with using just custom properties for styling/theming is that it places the onus on the element author to basically declare every possible styleable property as a custom property. As a result, [@apply](http://tabatkins.github.io/specs/css-apply-rule/) was proposed, which basically allowed a custom property to hold an entire ruleset (a bag of other properties!). [Tab Atkins](https://twitter.com/tabatkins) has a very good [post](https://www.xanthir.com/b4o00) as to why this approach was abandoned, but the tl;dr; is that it interacted pretty poorly with pseudo classes and elements (like `:focus`, `:hover`, `::placeholder` for input), which still meant the element author would have to define a looooot of these bags of properties to be used in the right places.

## And now: something different but the same

The current new proposal is [::part and ::theme](https://drafts.csswg.org/css-shadow-parts-1/), a set of pseudo-elements that allow you to style inside a shadow tree, from outside of that shadow tree. Unlike `:shadow` and `/deep/`, they don't allow you to style arbitrary elements inside a shadow tree: they only allow you to style elements that an author has tagged as being eligible for styling. They've already gone through the CSS working group and were blessed, and were brought up at TPAC at a Web Components session, so we're confident they're both the right approach, and highly likely to be implemented as a spec by all browsers.

## How ::part works
You can specify a "styleable" part on any element in your shadow tree:

```html
<x-foo>
  #shadow-root
    <div part="some-box"><span>...</span></div>
    <input part="some-input">
    <div>...</div> /* not styleable
</x-foo>
```

If you're in a document that has an `<x-foo>` in it, then you can style those parts with:
```css
x-foo::part(some-box) { ... }
```

You **can** use other pseudo elements or selectors (that were not explicitly exposed as shadow parts), so both of these work:

```css
x-foo::part(some-box):hover { ... }
x-foo::part(some-input)::placeholder { ... }
```

You **cannot** select inside of those parts, so this **doesn't** work:

```css
x-foo::part(some-box) span { ... } nor
x-foo::part(some-box)::part(some-other-thing) { ... }
```

You **cannot** style this part more than one level up if you don't forward it. So without any extra work, if you have an element that contains an `x-foo` like this:

```html
<x-bar>
  #shadow-root
    <x-foo></x-foo>
</x-bar>
```

You **cannot** select and style the `x-foo`'s part like this:

```css
x-bar::part(some-box) { ... }
```

### Forwarding parts
You **can** explicitly forward a child's part to be styleable outside of the parent's shadow tree. So in the previous example, to allow the `some-box` part to be styleable by `x-bar`'s parent, it would have to be exposed:

```html
<x-bar>
  #shadow-root
    <x-foo part="* => bar-*"></x-foo>
</x-bar>
````

The `::part` forwarding syntax has options a-plenty. 🙏 Feel free to skip these if
you're not interested in the minutiae of the syntax!

- `part="some-box => some-box, some-input => some-input"`: explicitly forward `x-foo`'s parts that you know about (i.e. `some-box` and `some-input`) as they are. These selectors **would** match:

  ```css
  x-bar::part(some-box) { ... }
  x-bar::part(some-input) { ... }
  ```

- `part="some-input => bar-input"`: explicitly forward (some) of `x-foo`'s parts (i.e. `some-input`) but rename them. These selectors **would** match:

  ```css
  x-bar::part(bar-input) { ... }
  ```
  These selectors would **not** match:
  ```css
  x-bar::part(some-box) { ... }
  x-bar::part(some-input) { ... }
  x-bar::part(bar-box) { ... }
  ```

- `part="* => bar-*"`: implicitly forward all of `x-foo`'s parts as they are, but prefixed. These selectors **would** match:

  ```css
  x-bar::part(bar-some-box) { ... }
  x-bar::part(bar-some-input) { ... }
  ```
  These selectors would **not** match:
  ```css
  x-bar::part(some-box) { ... }
  x-bar::part(some-input) { ... }
  ```

- You *can* chain these, as well as add a part to `x-foo` itself (`some-foo` below. This means "style this particular `x-foo`, but not the other one, if you had more). All of these are valid:

  ```html
  <x-bar>
    #shadow-root
      <x-foo part="some-foo, * => bar-*"></x-foo>
      /* or */
      <x-foo part="some-foo, some-input => bar-input"></x-foo>
  </x-bar>
  ```

- You **cannot** forward all parts at once, i.e. `part="* => *"` since this might break your element in the future (if the nested shadow element adds new parts). So this is invalid:

  ```html
  <x-form>
    #shadow-root
      <x-bar part="* => *">
        #shadow-root
          <x-foo part="* => *"></x-foo>
      </x-bar>
  </x-form>
  ```

- However, as mentioned, you can forward all the parts if you **prefix** them, so this is ok:

  ```html
  <x-form>
    #shadow-root
      <x-bar part="* => bar-*">
        #shadow-root
          <x-foo part="* => foo-*"></x-foo>
      </x-bar>
  </x-form>
  ```

  This selector would be valid:

  ```css
  x-form::part(bar-foo-some-input) { ... }
  ```

## The "all buttons in this app should be blue" 🎨 theming problem
Given the above prefixing rules, to style all inputs in a document at once, you need to
Ensure that all elements correctly forward their parts and
Select all their parts.

So given this shadow tree:
```html
<submit-form>
  #shadow-root
    <x-form part="some-input => some-input, some-box => some-box">
      #shadow-root
        <x-bar part="some-input => some-input, some-box => some-box">
          #shadow-root
            <x-foo part="some-input => some-input, some-box => some-box"></x-foo>
        </x-bar>
    </x-form>
</submit-form>

<x-form></x-form>
<x-bar></x-bar>
```

You can style all the inputs with:
```css
:root::part(some-input) { ... }
```

👉 This is a lot of effort on the element author, but easy on the theme user.

If you hadn't forwarded them with the same name and `some-input` was used at every level of the app (the non contrived example is just an `<a>` tag that's used in many shadow roots), then you'd have to write:

```css
:root::part(form-bar-foo-some-input),
:root::part(bar-foo-some-input,
:root::part(foo-some-input),
:root::part(some-input) { ... }
```

👉 This is a lot of effort on the theme user, but easy on the element author.

Both of these examples show that if an element author forgot to forward a part, then the app can't be themed correctly.

## How ::theme works
`::theme` matches any parts with that name, anywhere in the document. This means that if you hadn't forwarded any parts, i.e.:

```html
<x-bar>
  #shadow-root
    <x-foo></x-foo>
    <x-foo></x-foo>
    <x-foo></x-foo>
</x-bar>
```

You could style all of the inputs in x-bar with:
```css
x-bar::theme(some-input) { ... }
```

This can go arbitrarily deep in the shadow tree. So, no matter how deeply nested they are, you could style all the inputs with `part="some-input"` in the app with:
```css
:root::theme(some-input) { ... }   
```

## Demo
As mentioned before, this spec is still in the works and we don't have a shim that you can use in production. Hell, this shim isn't even guaranteed to work for all the cases that should work according to the spec, so you should take this code with an enormous iceberg of salt. This is a [demo](https://part-theme.glitch.me/) that illustrates styling and theming a bunch of vanilla custom elements in a form.

Some notes:

- this shim is meant for a demo prototype of the (still in the works) API. it is a very very very very rough shim, which means its performance is badly in the weeds (don't use it in production. don't use it for anything you care about)

- it probably has bugs and doesn't implement the spec 100%, and nobody will fix these bugs. Again, this shim wasn't ever meant to be used for realsies

- the shim is implemented as a mixin, which means you can only use `::part` or `::theme` inside of a custom element using that mixin (see `another-form.js`)
