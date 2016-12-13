---
layout: post
title: "Polymer Cheat Sheet"
category: posts
draft: true
---

<style>
.highlight .err {
  color: inherit;
  background-color: inherit;
}
.highlight .s1, .highlight .s {
  color: #336699;
  background: inherit;
}
pre {
  margin-bottom: 30px;
}
pre, code {
  background: #f4f6f8;
}
p > code, li > code {
  font-weight: bold;
}
pre {
  border-bottom: solid 1px #CFD8DC;
}
</style>

This is a cheat sheet for the [Polymer 1.x](https://www.polymer-project.org/1.0/) library.
It helps you write Web Components, which are pretty 💣. If you're interested in a
Polymer 2.0 cheat sheet, stay tuned: it will come.

* TOC
{:toc}

## Defining an element

Docs: [registering an element](https://www.polymer-project.org/1.0/docs/devguide/registering-elements),
[behaviours](https://www.polymer-project.org/1.0/docs/devguide/registering-elements#prototype-mixins),
[shared style modules](https://www.polymer-project.org/1.0/docs/devguide/styling#style-modules).

```html
<dom-module id="element-name">
  <template>
    <!-- Use one of these style declarations, but not both -->
    <!-- Use this if you don’t want to include a shared style -->
    <style></style>
    <!-- Use this if you want to include a shared style -->
    <style include="some-style-module-name"></style>
  </template>
  <script>
    Polymer({
      is: 'element-name',
      // All of these are optional. Only keep the ones you need.
      behaviors: [],
      observers: [],
      listeners: {},
      hostAttributes: {},
      properties: {}
    });
  </script>
</dom-module>
```

## Defining a behaviour

Docs: [behaviors](https://www.polymer-project.org/1.0/docs/devguide/behaviors).

Defining a behavior to share implementation between different elements:

```html
<script>
  Polymer.MyFancyBehaviorImpl = {
    // Code that you want common to elements, such
    // as behaviours, methods, etc.
  }

  Polymer.MyFancyBehavior = [
    MyFancyBehaviorImpl,
    /* You can add other behaviours here */
  ];
</script>
```

Using the behavior in an element:

```html
<dom-module id="element-name">
  <template>
    <!-- ... -->
  </template>
  <script>
    Polymer({
      is: 'element-name',
      behaviors: [Polymer.MyCustomButtonBehavior]
      /* ... */
    });
  </script>
</dom-module>
```

## Lifecycle methods

Docs: [lifecycle callbacks](https://www.polymer-project.org/1.0/docs/devguide/registering-elements#lifecycle-callbacks).

```js
Polymer({
  registered: function() {},
  created: function() {},
  ready: function() {},
  attached: function() {},
  detached: function() {}
});
```

There's an `attributeChanged` callback as well, but that's very rarely used.

## Data binding
Docs: [data binding](https://www.polymer-project.org/1.0/docs/devguide/data-binding),
[attribute binding](https://www.polymer-project.org/1.0/docs/devguide/data-binding#attribute-binding),
[binding to array items](https://www.polymer-project.org/1.0/docs/devguide/data-binding#bind-array-item),
[computed bindings](https://www.polymer-project.org/1.0/docs/devguide/data-binding#annotated-computed).

Don't forget: Polymer [camel-cases](https://www.polymer-project.org/1.0/docs/devguide/properties#property-name-mapping) properties, so if in JavaScript you use `myProperty`,
in HTML you would use `my-property`.

**One way** binding: when `myProperty` changes, `theirProperty` gets updated:

```html
<some-element their-property="[[myProperty]]"></some-element>
```

**Two way** binding: when `myProperty` changes, `theirProperty` gets updated,
and vice versa:

```html
{% raw %}<some-element their-property="{{myProperty}}"></some-element>{% endraw %}
```

**Attribute binding**: when `myProperty` is `true`, the element is hidden; when it's
`false`, the element is visible:

```html
<some-element hidden$="[[myProperty]]"></some-element>
```

**Computed binding**: binding to the `class` attribute will recompile styles when
`myProperty` changes:

```html
<some-element class$="[[_computeSomething(myProperty)]]"></some-element>

_computeSomething: function(prop) {
  return prop ? 'a-class-name' : 'another-class-name';
}
```

## Observers

Docs: [observers](https://www.polymer-project.org/1.0/docs/devguide/observers),
[multi-property observers](https://www.polymer-project.org/1.0/docs/devguide/observers#multi-property-observers),
[observing array mutations](https://www.polymer-project.org/1.0/docs/devguide/observers#array-observation).

Adding an `observer` in the `properties` block lets you observe changes in the
value of a property:

```js
properties: {
  myProperty: {
    observer: '_myPropertyChanged'
  }
},

// The second argument is optional, and gives you the
// previous value of the property, before the update:
_myPropertyChanged: function(value, /*oldValue */) {
  //...
}
```

In the `observers` block:

```js
observers: [
  '_doSomething(myProperty)',
  '_multiPropertyObserver(myProperty, anotherProperty)',
  '_observerForASubProperty(user.name)',
  // Below, items can be an array or an object:'
  '_observerForABunchOfSubPaths(items.*)'
]
```

## Listeners
Docs: [event listeners](https://www.polymer-project.org/1.0/docs/devguide/events#event-listeners),
[imperative listeners](https://www.polymer-project.org/1.0/docs/devguide/events#imperative-listeners).

```js
listeners: {
  'click': '_onClick',
  'input': '_onInput',
  'something-changed': '_onSomethingChanged'
}
```

## Properties block

Docs: [declared properties](https://www.polymer-project.org/1.0/docs/devguide/properties),
[object/array properties](https://www.polymer-project.org/1.0/docs/devguide/properties#configuring-object-and-array-properties),
[read-only properties](https://www.polymer-project.org/1.0/docs/devguide/properties#read-only),
[computed properties](https://www.polymer-project.org/1.0/docs/devguide/observers#define-a-computed-property).

There are all the possible things you can use in the `properties`
block. Don't just use all of them because you can; some (like `reflectToAttribute`
  and `notify`) can have performance implications.

```js
properties: {
  basic: {
    type: Boolean | Number | String | Array | Object,

    // Value can be one of the types above, eg:
    value: true,

    // For an Array or Object, you must return it from a function
    // (otherwise the array will be defined on the prototype
    // and not the instance):
    value: function() { return ['cheese', 'pepperoni', 'more-cheese'] },

    reflectToAttribute: true | false,
    readOnly: true | false,
    notify: true | false
  },

  // Computed properties are essentially read-only, and can only be
  // updated when their dependencies change.
  basicComputedProperty: {
    computed: '_someFunction(myProperty, anotherProperty)'
  }
}
```

## Observing added and removed children

Docs: [DOM distribution](https://www.polymer-project.org/1.0/docs/devguide/local-dom#dom-distribution),
[observe nodes](https://www.polymer-project.org/1.0/docs/devguide/local-dom#observe-nodes).

If you have a content node for distribution:

```html
<template>
  <slot id="distributed"></slot>
</template>
```
And you want to be notified when nodes have been added/removed:

```js
attached: function() {
  this._observer =
    Polymer.dom(this.$.distributed).observeNodes(function(info) {
    // info is {addedNodes: [...], removedNodes: [...]}
  });
},
detached: function() {
  Polymer.dom(this.$.distributed).unobserveNodes(this._observer);
}
```

## Style modules
Docs: [shared style modules](https://www.polymer-project.org/1.0/docs/devguide/styling#style-modules).

Defining styles that will be shared across different elements, in a file called
`my-shared-styles.html` (for example):

```html
<dom-module id="my-shared-styles">
  <template>
    <style>
      .red { color: red; }
      /* Custom property defined in the global scope */
      html {
        --the-best-red: #e91e63;
      }
    </style>
  </template>
</dom-module>
```

Include the shared style in a custom element:

```html
<link rel="import" href="my-shared-styles.html">
<dom-module id="element-name">
  <template>
    <style include="my-shared-styles">
      /* Other styles in here */
    </style>
  </template>
  <script>
    Polymer({ is: 'element-name' });
  </script>
</dom-module>
```

Include the shared style in the main document:

```html
<html>
<head>
  <link rel="import" href="my-shared-styles.html">
  <style is="custom-style" include="my-shared-styles">
    /* Other styles in here */
  </style>
</head>
<body>...</body>
</html>
```

## Styling with custom properties and mixins

Docs: [styling](https://www.polymer-project.org/1.0/docs/devguide/styling),
[CSS properties](https://www.polymer-project.org/1.0/docs/devguide/styling#custom-css-properties),
[CSS mixins](https://www.polymer-project.org/1.0/docs/devguide/styling#custom-css-mixins),
[shim limitations](https://www.polymer-project.org/1.0/docs/devguide/styling#custom-properties-shim-limitations)

Note that the examples below depend on browser support for custom properties.
For how to use the shim (spoilers: it's `<style is="custom-style">`) and its limitations,
check the docs linked above.

Defining a custom property:

```css
html /* or :host, or :root etc. */{
  --my-custom-radius: 5px;
}
```

Using a custom property:

```css
.my-image {
  border-radius: var(--my-custom-radius);
}
```

Using a custom property with a fallback:

```css
.my-image {
  border-radius: var(--my-custom-radius, 3px);
}
```

Using a custom property with a custom property fallback:

```css
.my-image {
  border-radius: var(--my-custom-radius, var(--my-fallback));
}
```

Defining a mixin:

```css
some-custom-element {
  --my-custom-mixin: {
    border-radius: 5px;
  };
}
```

Using a mixin:

```css
.my-image {
  @apply --my-custom-mixin;
}
```

## Binding helper elements

Docs: [dom-repeat](https://www.polymer-project.org/1.0/docs/api/dom-repeat),
[dom-bind](https://www.polymer-project.org/1.0/docs/api/dom-bind),
[dom-if](https://www.polymer-project.org/1.0/docs/api/dom-if)

`dom-repeat` stamps and binds a template for each item in an array:

```html
{% raw %}<template is="dom-repeat" items="{{employees}}">
  <div>First name: <span>{{item.first}}</span></div>
  <div>Last name: <span>{{item.last}}</span></div>
</template>{% endraw %}
```

`dom-bind` stamps itself into the main document and adds a binding scope:

```html
{% raw %}<html>
<body>
  <template is="dom-bind">
    <paper-input value="{{myText}}"></paper-input>
    <span>You typed: [[myText]]</span>
  </template>
</body>
<html>{% endraw %}
```

`dom-if` stamps itself conditionally based on a property's value:

```html
{% raw %}<template is="dom-if" if="{{myProperty}}">
  <span>This content will appear when myProperty is truthy.</span>
</template>{% endraw %}  
```
