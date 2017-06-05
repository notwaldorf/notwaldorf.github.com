---
layout: post
title: "Polymer 2.x Cheat Sheet"
category: posts
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

This is a cheat sheet for the [Polymer 2.x](https://www.polymer-project.org/) library.
If you're looking for the Polymer 1.x cheat sheet, it is [here](../polymer-cheatsheet/). If you think something
is missing from this page, [tell me](https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fmeowni.ca%2F&ref_src=twsrc%5Etfw&text=@notwaldorf%20Polymer%202%20cheat%20sheet%20feature%20request:) about it!


* TOC
{:toc}

## Defining an element

Docs: [1.x -> 2.x upgrade guide](https://www.polymer-project.org/2.0/docs/upgrade),
[registering an element](https://www.polymer-project.org/2.0/docs/devguide/registering-elements),
[shared style modules](https://www.polymer-project.org/2.0/docs/devguide/style-shadow-dom#style-modules).

```html
<link rel="import" href="bower_components/polymer/polymer-element.html">
<dom-module id="element-name">
  <template>
    <!-- Use one of these style declarations, but not both -->
    <!-- Use this if you don’t want to include a shared style -->
    <style></style>
    <!-- Use this if you want to include a shared style -->
    <style include="some-style-module-name"></style>
  </template>
  <script>
    class MyElement extends Polymer.Element {
      static get is() { return 'element-name'; }
      // All of these are optional. Only keep the ones you need.
      static get properties() { ... }
      static get observers() { ... }
    }

    // Associate the new class with an element name
    customElements.define(MyElement.is, MyElement);
  </script>
</dom-module>
```

To get the class definition for a particular custom tag, you can use
`customElements.get('element-name')`.

## Extending an element

Docs: [extending elements](https://www.polymer-project.org/2.0/docs/devguide/custom-elements#extending-other-elements), [inherited templates](https://www.polymer-project.org/2.0/docs/devguide/dom-template#inherited-templates).

Instead of `Polymer.Element`, a custom element can extend a different element):
```js
class ParentElement extends Polymer.Element {
  /* ... */
}
class ChildElement extends ParentElement {
  /* ... */
}
```

To change or add to the parent's template, override the `template` getter:

```html
<dom-module id="child-element">
  <template>
    <style> /* ... */ </style>
    <span>bonus!</span>
   </template>
  <script>
    var childTemplate;
    var childTemplate = Polymer.DomModule.import('child-element', 'template');
    var parentTemplate = ParentElement.template.cloneNode(true);
    // Or however you want to assemble these.
    childTemplate.content.insertBefore(parentTemplate.firstChild, parentTemplate);

    class ChildElement extends ParentElement {
      static get is() { return 'child-element'; }
      // Note: the more work you do here, the slower your element is to
      // boot up. You should probably do the template assembling once, in a
      // static method outside your class (like above).
      static get template() {
        return childTemplate;
      }
    }
    customElements.define(ChildElement.is, ChildElement);
  </script>
</dom-module>
```

If you don't know the parent class, you can also use:

```js
class ChildElement extends customElement.get('parent-element') {
  /* ... */
}
```

## Defining a mixin

Docs: [mixins](https://www.polymer-project.org/2.0/docs/devguide/custom-elements#mixins),
[hybrid elements](https://www.polymer-project.org/2.0/docs/devguide/hybrid-elements).

Defining a class expression mixin to share implementation between different elements:

```html
<script>
  MyMixin = function(superClass) {
    return class extends superClass {
      // Code that you want common to elements.
      // If you're going to override a lifecycle method, remember that a) you
      // might need to call super but b) it might not exist
      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }
        /* ... */
      }
    }
  }
</script>
```

Using the mixin in an element definition:

```html
<dom-module id="element-name">
  <template><!-- ... --></template>
  <script>
    // This could also be a sequence:
    //class MyElement extends AnotherMixin(MyMixin(Polymer.Element)) { … }
    class MyElement extends MyMixin(Polymer.Element) {
      static get is() { return 'element-name' }
      /* ... */
    }
    customElements.define(MyElement.is, MyElement);
  </script>
</dom-module>
```

Using hybrid behaviors (defined in the 1.x syntax) as mixins:

```html
<dom-module id="element-name">
  <template><!-- ... --></template>
  <script>
    class MyElement extends Polymer.mixinBehaviors([MyBehavior, MyBehavior2], Polymer.Element) {
     static get is() { return 'element-name' }
     /* ... */
    }
    customElements.define('element-name', MyElement);
  </script>
</dom-module>
```

## Lifecycle methods

Docs: [lifecycle callbacks](https://www.polymer-project.org/2.0/docs/devguide/custom-elements#element-lifecycle),
[ready](https://www.polymer-project.org/2.0/docs/devguide/custom-elements#one-time-initialization).

```js
class MyElement extends Polymer.Element {
 constructor() { super(); /* ... */}
 ready() { super.ready(); /* ... */}
 connectedCallback() { super.connectedCallback(); /* ... */}
 disconnectedCallback() { super.disconnectedCallback(); /* ... */}
 attributeChangedCallback() { super.attributeChangedCallback(); /* ... */}
}
```

## Data binding
Docs: [data binding](https://www.polymer-project.org/2.0/docs/devguide/data-binding),
[attribute binding](https://www.polymer-project.org/2.0/docs/devguide/data-binding#attribute-binding),
[binding to array items](https://www.polymer-project.org/2.0/docs/devguide/data-binding#bind-array-item),
[computed bindings](https://www.polymer-project.org/2.0/docs/devguide/data-binding#annotated-computed).

Don't forget: Polymer [camel-cases](https://www.polymer-project.org/2.0/docs/devguide/properties#property-name-mapping) properties, so if in JavaScript you use `myProperty`,
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
`false`, the element is visible. The difference between attribute and property
binding is that property binding is equivalent to `someElement.someProp = value`,
whereas attribute binding is equivalent to: `someElement.setAttribute(someProp, value)`

```html
<some-element hidden$="[[myProperty]]"></some-element>
```

**Computed binding**: binding to the `class` attribute will recompile styles when
`myProperty` changes:

```html
<some-element class$="[[_computeSomething(myProperty)]]"></some-element>
<script>
_computeSomething: function(prop) {
  return prop ? 'a-class-name' : 'another-class-name';
}
</script>
```

## Observers

Docs: [observers](https://www.polymer-project.org/2.0/docs/devguide/observers),
[multi-property observers](https://www.polymer-project.org/2.0/docs/devguide/observers#multi-property-observers),
[observing array mutations](https://www.polymer-project.org/2.0/docs/devguide/observers#array-observation),
[adding observers dynamically](https://www.polymer-project.org/2.0/docs/devguide/observers#dynamic-observers).

Adding an `observer` in the `properties` block lets you observe changes in the
value of a property:

```js
static get properties() {
  return {
    myProperty: {
      observer: '_myPropertyChanged'
    }
  }
}

// The second argument is optional, and gives you the
// previous value of the property, before the update:
_myPropertyChanged(value, /*oldValue */) { /* ... */ }
```

In the `observers` block:

```js
static get observers() {
  return [
    '_doSomething(myProperty)',
    '_multiPropertyObserver(myProperty, anotherProperty)',
    '_observerForASubProperty(user.name)',
    // Below, items can be an array or an object:'
    '_observerForABunchOfSubPaths(items.*)'
  ]
}
```

Adding an observer dynamically for a property `otherProperty`:
```js
// Define a method
_otherPropertyChanged(value) { /* ... */ }
// Call it when `otherPropety` changes
this._createPropertyObserver('otherProperty', '_otherPropertyChanged', true);
```

## Listeners
In Polymer 2.0, we recommend that rather than using the `listeners` block,
you #useThePlatform and define event listeners yourself:

```js
ready() {
  super.ready();
  window.addEventListener('some-event', () => this.someFunction());
}
```

There is a [PR](https://github.com/Polymer/polymer/pull/4632) out to add a
declarative listener block as a mixin. Stay tuned!

## Properties block

Docs: [declared properties](https://www.polymer-project.org/2.0/docs/devguide/properties),
[object/array properties](https://www.polymer-project.org/2.0/docs/devguide/properties#configuring-object-and-array-properties),
[read-only properties](https://www.polymer-project.org/2.0/docs/devguide/properties#read-only),
[computed properties](https://www.polymer-project.org/2.0/docs/devguide/observers#computed-properties),
[adding computed properties dynamically](https://www.polymer-project.org/2.0/docs/devguide/observers#add-a-computed-property-dynamically).

There are all the possible things you can use in the `properties`
block. Don't just use all of them because you can; some (like `reflectToAttribute`
  and `notify`) can have performance implications.

```js
static get properties() {
  return {
    basic: {
      type: Boolean | Number | String | Array | Object,

      // Default value of the property can be one of the types above, eg:
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
}
```

Adding a computed property dynamically:
```js
this._createComputedProperty('newProperty', '_computeNewProperty(prop1,prop2)', true);
```

## Observing added and removed children

Docs: [Shadow DOM distribution](https://www.polymer-project.org/2.0/docs/devguide/shadow-dom#shadow-dom-and-composition),
[observe nodes](https://www.polymer-project.org/2.0/docs/upgrade#polymer-dom-apis).

If you have a content node for distribution:

```html
<template>
  <slot></slot>
</template>
```
And you want to be notified when nodes have been added/removed:

```html
<!-- You need to import the observer -->
<link rel="import" href="/bower_components/polymer/lib/utils/flattened-nodes-observer.html">

<script>
class MyElement extends Polymer.Element {
  /* ... */
  connectedCallback: function() {
    super.connectedCallback();
    this._observer = new Polymer.FlattenedNodesObserver(function(info) {
    // info is {addedNodes: [...], removedNodes: [...]}
    });
  }
  disconnectedCallback: function() {
    super.disconnectedCallback();
    this._observer.disconnect();
  }
}
</script>
```

## Style modules
Docs: [shared style modules](https://www.polymer-project.org/2.0/docs/devguide/style-shadow-dom#style-modules).

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
    class MyElement extends Polymer.Element {
      /* ... */
    }
  </script>
</dom-module>
```

Include the shared style in the main document:

```html
<html>
<head>
  <!-- Import the custom-style element -->
  <link rel="import" href="components/polymer/lib/elements/custom-style.html">
  <link rel="import" href="my-shared-styles.html">
  <custom-style>
    <style include="my-shared-styles">
      /* Other styles in here */
    </style>
  </custom-style>
</head>
<body>...</body>
</html>
```

## Styling with custom properties and mixins

Docs: [styling](https://www.polymer-project.org/2.0/docs/devguide/style-shadow-dom),
[CSS properties](https://www.polymer-project.org/2.0/docs/devguide/custom-css-properties),
[CSS mixins](https://www.polymer-project.org/2.0/docs/devguide/custom-css-properties#use-custom-css-mixins),
[shim limitations](https://www.polymer-project.org/2.0/docs/devguide/custom-css-properties#custom-properties-shim-limitations)

Note that the examples below depend on browser support for custom properties and mixins.

Defining a custom property:

```css
html /* or :host etc. */{
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

If you want to use mixins, you need to include the CSS mixins shim.
For how to use the shim and its limitations, check the docs linked at the
beginning of the section.
```html
<link rel="import" href="/bower_components/shadycss/apply-shim.html">
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

Docs: [dom-repeat](https://www.polymer-project.org/2.0/docs/devguide/templates#dom-repeat),
[dom-bind](https://www.polymer-project.org/2.0/docs/devguide/templates#dom-bind),
[dom-if](https://www.polymer-project.org/2.0/docs/devguide/templates#dom-if)

There are two ways to use the helper elements:
- inside a Polymer element/Polymer managed template: just use the `<template is=...>`
syntax, without the wrapper, for example:

```html
{% raw %}<template is="dom-repeat">
  ...
</template>{% endraw %}
```
- outside of a Polymer managed template: use the `<dom-...>` wrapper element
around a `<template>`, for example:

```html
{% raw %}<dom-repeat>
  <template>
    ...
  </template>
</dom-repeat>{% endraw %}
```


`dom-repeat` stamps and binds a template for each item in an array:

```html
{% raw %}<link rel="import" href="components/polymer/lib/elements/dom-repeat.html">
<dom-repeat items="[[employees]]">
  <template>
    <div>First name: <span>[[item.first]]</span></div>
    <div>Last name: <span>[[item.last]]</span></div>
  </template>
</dom-repeat>{% endraw %}
```

`dom-bind` stamps itself into the main document and adds a binding scope:

```html
{% raw %}<link rel="import" href="components/polymer/lib/elements/dom-bind.html">
<html>
<body>
  <dom-bind>
    <template>
      <paper-input value="{{myText}}"></paper-input>
      <span>You typed: [[myText]]</span>
    </template>
  </dom-bind>
</body>
<html>{% endraw %}
```

`dom-if` stamps itself conditionally based on a property's value:

```html
{% raw %}<link rel="import" href="components/polymer/lib/elements/dom-if.html">
<dom-if if="[[myProperty]]">
  <template>
    <span>This content will appear when myProperty is truthy.</span>
  </template>
</dom-if>{% endraw %}  
```
