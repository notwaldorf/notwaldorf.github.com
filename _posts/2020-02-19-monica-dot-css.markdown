---
layout: post
title: "monica.css"
category: posts
---

Back in the day when I worked on Polymer I got used to relying on a bunch of useful CSS classes 
that at the time we called [iron-flex-layout](https://github.com/PolymerElements/iron-flex-layout/blob/master/iron-flex-layout-classes.js).
They were there partly because flexbox was a sadness on IE and you needed to say everything 3 times to maybe
get it right twice, and add some 
very special `flex-basis: 0.000000001px;`
"bug fixes" that tbh nobody should ever have to write by hand. But they were also there because it's kind of nice to say `<div class="horizontal">` 
and for it to just work.

Some years later, it's now 2020, and flexbox is really good everywhere! We don't need `iron-flex-layout` anymore, but tbh I still
want to say `<div class="horizontal">` and for it to just work.

I know there are tons of CSS frameworks out there like [tachyons](https://tachyons.io/) that can do this for me, but most of these frameworks
do _too much_ for me. I don't work on large projects that need design systems, and I don't want every possible padding and margin and colour and flexbox configuration in the world. I just
want the ones that I know I end up using in every project. So here is `monica.css`: my very own CSS framework, which I copy paste at the beginning of every CSS file and take it from there. It's already minified and bundled (because you copy pasted it) so dare I say: fast loading and efficient? 🙃

```css
* {box-sizing: border-box}
[hidden] {display: none !important}
[disabled] {pointer-events:none; opacity: 0.3}
.horizontal {display: flex; flex-direction: row; justify-content: space-between}
.vertical {display: flex; flex-direction: column}
.center {justify-content: center; align-items: center}
.top {align-items: flex-start}
.flex {flex: 1}
html {
  --spacing-xs: 8px;
  --spacing: 24px;
  --spacing-s: 12px;
  --spacing-m: 36px;
}
```
