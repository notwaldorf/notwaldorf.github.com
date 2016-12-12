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
pre, code {
  background: #f4f6f8;
}
</style>

This is a cheat sheet for the [Polymer 1.x](https://www.polymer-project.org/1.0/) library.
It helps you write Web Components, which are pretty 💣. If you're interested in a
Polymer 2.0 cheat sheet, stay tuned: it will come.

## Defining an element

Docs: [registering an element](https://www.polymer-project.org/1.0/docs/devguide/registering-elements),
[behaviours](https://www.polymer-project.org/1.0/docs/devguide/registering-elements#prototype-mixins),
[shared style modules](https://www.polymer-project.org/1.0/docs/devguide/styling#style-modules).

```html
<dom-module id="element-name">
  <template>
    <!-- Use one of these style declarations, but not both -->
    <!-- 1. Use this if you don’t want to include a shared style module -->
    <style></style>
    <!-- 2. Use this if you do -->
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

## Lifecycle methods

Docs: [lifecycle callbacks](https://www.polymer-project.org/1.0/docs/devguide/registering-elements#lifecycle-callbacks).

```js
Polymer({
  created: function() {},
  ready: function() {},
  attached: function() {},
  detached: function() {},
  attributeChanged: function(attrType, attrType) {}
});
```

## Data binding
Docs: [data binding](https://www.polymer-project.org/1.0/docs/devguide/data-binding),
[attribute binding](https://www.polymer-project.org/1.0/docs/devguide/data-binding#attribute-binding),
[binding to array items](https://www.polymer-project.org/1.0/docs/devguide/data-binding#bind-array-item),
[computed bindings](https://www.polymer-project.org/1.0/docs/devguide/data-binding#annotated-computed).

Note: Polymer camel-cases properties, so if in JavaScript you use `aProperty`,
in HTML you would use `a-property`.

**One way binding**: when `anotherProperty` changes, `aProperty` gets updated:

```html
<some-element a-property="[[anotherProperty]]"></some-element>
```

**Two way binding**: when `anotherProperty` changes, `aProperty` gets updated,
and vice versa:

```html
{% raw %}<some-element a-property="{{anotherProperty}}"></some-element>{% endraw %}
```

**Attribute binding**:

```html
<some-element hidden$="[[aProperty]]"></some-element>
```

**Computed binding**: binding to the `class` attribute will recompile styles when
`aProperty` changes:

```html
<some-element class$="[[_computeSomething(aProperty)]]"></some-element>

_computeSomething: function(prop) {
  return 'a-class-name';
}
```

## Observers

Docs: [observers](https://www.polymer-project.org/1.0/docs/devguide/observers),
[multi-property observers](https://www.polymer-project.org/1.0/docs/devguide/observers#multi-property-observers).

In the `properties` block:

```js
properties: {
  aProperty: {
    observer: '_aPropertyChanged'
  }
}
```

In the `observers` block:

```js
observers: [
  '_doSomething(aProperty)',
  '_multiPropertyObserver(aProperty, anotherProperty)',
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
block. Don't just use all of them because you can; some have performance
implications.

```js
properties: {
  basic: {
    type: Boolean | Number | String | Array | Object,

    // Value can be one of the types above, eg:
    value: Boolean,

    // For an Array or Object, you must return it from a function (otherwise the array will be defined on the prototype and not the instance):
    value: function() { return ['cheese', 'pepperoni', 'more-cheese'] },

    reflectToAttribute: true | false,
    readOnly: true | false,
    notify: true | false
  },
  basicComputedProperty: {
    computed: '_someFunction(aProperty, anotherProperty)'
  }
}
```

## Observing added and removed children

Docs: [DOM distribution](https://www.polymer-project.org/1.0/docs/devguide/local-dom#dom-distribution),
[observe nodes](https://www.polymer-project.org/1.0/docs/devguide/local-dom#observe-nodes).

If you have a content node for distribution:

```html
<template>
  <slot id="contentNode"></slot>
</template>
```
And you want to be notified when nodes have been added/removed:

```js
attached: function() {
  this._observer =
    Polymer.dom(this.$.contentNode).observeNodes(function(info) {
    // ...
  });
},
detached: function() {
  Polymer.dom(this.$.contentNode).unobserveNodes(this._observer);
}
```

## Styling

Docs: [styling](https://www.polymer-project.org/1.0/docs/devguide/styling),
[CSS properties](https://www.polymer-project.org/1.0/docs/devguide/styling#custom-css-properties),
[CSS mixins](https://www.polymer-project.org/1.0/docs/devguide/styling#custom-css-mixins),
[shim limitations](https://www.polymer-project.org/1.0/docs/devguide/styling#custom-properties-shim-limitations)

Defining a custom property:

```css
--my-custom-radius: 5px;
```

Using a custom property:

```css
border-radius: var(--my-custom-radius);
```

Using a custom property with a fallback:

```css
border-radius: var(--my-custom-radius, 3px);
```

Using a custom property with a custom property fallback:

```css
border-radius: var(--my-custom-radius, var(--my-fallback));
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
