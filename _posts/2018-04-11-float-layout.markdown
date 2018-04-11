---
layout: post
title: "How browsers position floats"
category: posts
---
<style>
  iframe {
    height: 800px;
    width: 100%;
    margin: 0 auto;
    border: 5px solid #E0F7FA;
    border-radius: 3px;
  }
</style>

When you have a `float` CSS property on a box (with a value different than `none`), this box
must be laid out according to the **float positioning algorithm**. Loosely, it says:

- if the box has `float:left`, the box is positioned at the beginning of the line box
- if the box has `float:right`, the box is positioned at the end of the line box
- text (and more generally anything within the normal, non-floaty flow) is laid out along the edges of the floating boxes
- the `clear` property changes the floating behaviour.

Anyway, in general you'll have a better time if you use a flexbox or CSS grid instead of floats, because floats are quirky and have strange edge cases, but if you were ever curious
about how the algorithm would choose where to position different floats, here's a demo
(which you can also play with directly on [glitch](https://float-layout.glitch.me)):

<iframe src="https://float-layout.glitch.me/demo.html" frameBorder="0"></iframe>
